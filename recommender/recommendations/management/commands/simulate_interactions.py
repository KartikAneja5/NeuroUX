from django.core.management.base import BaseCommand

class Command(BaseCommand):
    help = 'Simulates user interaction data'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Successfully simulated interaction data'))
