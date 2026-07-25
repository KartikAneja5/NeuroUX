"""
warm_cache.py — Pre-warms the recommendation cache for all active products.
Run on Django startup or manually: python manage.py warm_cache
This prevents cold-start latency on the first request after a server restart.
"""
from django.core.management.base import BaseCommand
from recommendations.db.data_access import get_products
from recommendations.engine.hybrid import get_hybrid_recommendations
from recommendations.engine.cache import recommendation_cache


class Command(BaseCommand):
    help = 'Pre-warms the in-memory recommendation cache for all active products.'

    def handle(self, *args, **options):
        recommendation_cache.clear()
        self.stdout.write('Cache cleared. Warming recommendations for all active products...')

        products_df = get_products()
        if products_df.empty:
            self.stdout.write(self.style.WARNING('No active products found — cache not warmed.'))
            return

        product_ids = products_df['_id'].tolist()
        warmed = 0
        failed = 0

        for pid in product_ids:
            try:
                result = get_hybrid_recommendations(str(pid), top_n=6)
                warmed += 1
                self.stdout.write(f'  OK: Warmed {pid} -> {len(result)} recommendations')
            except Exception as e:
                failed += 1
                self.stdout.write(self.style.WARNING(f'  FAIL: {pid}: {e}'))

        self.stdout.write(self.style.SUCCESS(
            f'\nCache warmed: {warmed} products OK, {failed} failed. '
            f'TTL = 300s (5 minutes).'
        ))
