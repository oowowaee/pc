from django.contrib import admin
from .models import PointOfInterest, AvailableLanguage, City, Reviewer, Tag, Review, NameTranslation

# Register your models here.
admin.site.register(PointOfInterest)
admin.site.register(AvailableLanguage)
admin.site.register(City)
admin.site.register(Reviewer)
admin.site.register(Tag)
admin.site.register(Review)
admin.site.register(NameTranslation)