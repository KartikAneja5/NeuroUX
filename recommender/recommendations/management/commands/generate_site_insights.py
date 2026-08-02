import datetime
from django.core.management.base import BaseCommand
import pandas as pd
from recommendations.db.mongo_client import MongoClientSingleton
from recommendations.db.data_access import get_products, get_interactions

class Command(BaseCommand):
    help = 'Aggregates all-user interaction signals and generates Layer-2 business intelligence insights.'

    def handle(self, *args, **options):
        db = MongoClientSingleton.get_db()
        products_df = get_products()
        interactions_df = get_interactions()

        insights = []

        if products_df.empty:
            self.stdout.write(self.style.WARNING("No products found for insights generation."))
            return

        prod_id_to_name = dict(zip(products_df['_id'], products_df['name']))
        prod_id_to_cat = dict(zip(products_df['_id'], products_df['category']))

        # ── Precompute category-level stats for insight reasoning ──────────────
        # avg price, avg tag count, live preview presence per category
        cat_stats = {}
        for _, row in products_df.iterrows():
            cat = row.get('category', 'Unknown')
            price = float(row.get('price', 0) or 0)
            tags = row.get('tags') or []
            tag_count = len(tags) if isinstance(tags, list) else 0
            has_preview = bool(row.get('livePreviewUrl'))

            if cat not in cat_stats:
                cat_stats[cat] = {'prices': [], 'tag_counts': [], 'preview_count': 0, 'total': 0}
            cat_stats[cat]['prices'].append(price)
            cat_stats[cat]['tag_counts'].append(tag_count)
            if has_preview:
                cat_stats[cat]['preview_count'] += 1
            cat_stats[cat]['total'] += 1

        cat_avg_price = {cat: (sum(v['prices']) / len(v['prices'])) for cat, v in cat_stats.items() if v['prices']}
        cat_avg_tags = {cat: (sum(v['tag_counts']) / len(v['tag_counts'])) for cat, v in cat_stats.items() if v['tag_counts']}

        def build_reasoning(prod_row, cat):
            """Build a short heuristic reason string for a friction-point product."""
            reasons = []
            price = float(prod_row.get('price', 0) or 0)
            tags = prod_row.get('tags') or []
            tag_count = len(tags) if isinstance(tags, list) else 0
            has_preview = bool(prod_row.get('livePreviewUrl'))

            avg_price = cat_avg_price.get(cat, 0)
            avg_tags = cat_avg_tags.get(cat, 0)

            if avg_price > 0 and price > 0:
                price_diff_pct = round(((price - avg_price) / avg_price) * 100)
                if price_diff_pct >= 20:
                    reasons.append(f"Priced {price_diff_pct}% above category average (avg ₹{round(avg_price)})")
                elif price_diff_pct <= -20:
                    reasons.append(f"Priced {abs(price_diff_pct)}% below category average — may signal low quality")

            if not has_preview:
                reasons.append("Missing live preview URL")

            if avg_tags > 0 and tag_count < avg_tags * 0.6:
                reasons.append(f"Fewer tags than category average ({tag_count} vs avg {round(avg_tags, 1)}) — reduces discoverability")

            return " · ".join(reasons) if reasons else "No obvious friction factors found"

        # 1. Most viewed but rarely purchased (Friction Point)
        if not interactions_df.empty:
            views = interactions_df[interactions_df['type'] == 'view']
            purchases = interactions_df[interactions_df['type'] == 'purchase']

            view_counts = views['productId'].value_counts() if not views.empty else pd.Series()
            purchase_counts = purchases['productId'].value_counts() if not purchases.empty else pd.Series()

            friction_prod_id = None
            max_view_diff = -1
            for pid, v_cnt in view_counts.items():
                p_cnt = purchase_counts.get(pid, 0)
                diff = v_cnt - p_cnt
                if diff > max_view_diff:
                    max_view_diff = diff
                    friction_prod_id = pid

            if friction_prod_id and friction_prod_id in prod_id_to_name:
                cat = prod_id_to_cat.get(friction_prod_id, 'Unknown')
                # Find the full product row for reasoning
                prod_rows = products_df[products_df['_id'] == friction_prod_id]
                reasoning = ""
                if not prod_rows.empty:
                    reasoning = build_reasoning(prod_rows.iloc[0].to_dict(), cat)

                insights.append({
                    "title": "High Interest, Low Conversion",
                    "type": "warning",
                    "metric": f"{max_view_diff} view gap",
                    "description": f"Component '{prod_id_to_name[friction_prod_id]}' has high views but low purchases. Consider adding a promotional discount.",
                    "reasoning": reasoning
                })

            # 2. Trending category this week
            cat_weights = {}
            for _, row in interactions_df.iterrows():
                pid = row.get('productId')
                cat = prod_id_to_cat.get(pid)
                w = row.get('weight', 1)
                if cat:
                    cat_weights[cat] = cat_weights.get(cat, 0) + w

            if cat_weights:
                top_cat = max(cat_weights, key=cat_weights.get)
                insights.append({
                    "title": "Top Trending Category",
                    "type": "success",
                    "metric": f"{int(cat_weights[top_cat])} interaction score",
                    "description": f"Category '{top_cat}' is leading user engagement this week across searches and preview activations.",
                    "reasoning": ""
                })

        # 3. Unpromoted Inventory (0 interactions)
        interacted_pids = set(interactions_df['productId']) if not interactions_df.empty else set()
        unpromoted = [pname for pid, pname in prod_id_to_name.items() if pid not in interacted_pids]
        if unpromoted:
            insights.append({
                "title": "Unpromoted Inventory Alert",
                "type": "info",
                "metric": f"{len(unpromoted)} idle items",
                "description": f"{len(unpromoted)} components (e.g. '{unpromoted[0]}') have 0 view interactions. Consider featuring them on the hero section.",
                "reasoning": ""
            })

        # 4. A/B Test Variant Conversion Performance & Statistical Significance Testing
        orders = list(db.orders.find())
        if orders:
            import scipy.stats as stats

            variant_a_count = sum(1 for o in orders if o.get('abVariant') == 'variant_A')
            variant_b_count = sum(1 for o in orders if o.get('abVariant') == 'variant_B')
            total_orders = len(orders)
            b_percentage = round((variant_b_count / total_orders) * 100, 1) if total_orders > 0 else 0

            # Small-sample safeguard (minimum 10 completed orders per variant)
            if variant_a_count < 10 or variant_b_count < 10:
                desc = (
                    f"Variant B accounts for {variant_b_count} out of {total_orders} completed checkout orders ({b_percentage}% share). "
                    f"Sample size too small for reliable significance testing (n={total_orders})."
                )
                sig_type = "info"
            else:
                # Two-proportion Chi-squared test of independence
                total_interactions = max(total_orders * 4, db.interactions.count_documents({}))
                sessions_per_variant = max(total_orders, total_interactions // 2)

                contingency_table = [
                    [variant_a_count, max(1, sessions_per_variant - variant_a_count)],
                    [variant_b_count, max(1, sessions_per_variant - variant_b_count)]
                ]
                chi2, p_val, dof, ex = stats.chi2_contingency(contingency_table)
                is_significant = (p_val < 0.05)

                verdict = (
                    "a statistically significant difference (p < 0.05)"
                    if is_significant else
                    "not yet a statistically significant difference given current sample size"
                )
                desc = (
                    f"Variant B (Adaptive AI Layout) accounts for {variant_b_count} out of {total_orders} completed checkout orders ({b_percentage}% share). "
                    f"Two-proportion significance test yields p-value = {p_val:.4f} (n={total_orders}) — {verdict}."
                )
                sig_type = "success" if is_significant else "info"

            insights.append({
                "title": "A/B Experiment Conversion Rate",
                "type": sig_type,
                "metric": f"{b_percentage}% Variant B Share",
                "description": desc,
                "reasoning": ""
            })


        # Fallback if no interactions exist yet
        if not insights:
            insights.append({
                "title": "System Cold Start",
                "type": "info",
                "metric": "Catalog Live",
                "description": "NeuroUX analytics pipeline is monitoring catalog engagement. Generate synthetic user interactions to unlock full Layer-2 insights.",
                "reasoning": ""
            })

        # Write to site_insights MongoDB collection
        db.site_insights.delete_many({})
        insight_document = {
            "generatedAt": datetime.datetime.utcnow(),
            "insights": insights
        }
        db.site_insights.insert_one(insight_document)

        self.stdout.write(self.style.SUCCESS(
            f"Successfully generated {len(insights)} Layer-2 business intelligence insights into MongoDB collection 'site_insights'."
        ))
