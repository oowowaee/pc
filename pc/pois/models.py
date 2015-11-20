from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

#Simple model that has and is represented by a name.
class NamedModel(models.Model):
	name = models.CharField(unique=True, max_length=24)

	def __str__(self):
		return '%s' % self.name

	class Meta:
		abstract = True

class PointOfInterest(NamedModel):
	city = models.ForeignKey('City')
	rating = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(5)])
	latitude = models.DecimalField(decimal_places = 2, max_digits=5)
	longitude = models.DecimalField(decimal_places = 2, max_digits=5)
	address = models.CharField(blank=True, null=True, max_length=56)
	tags = models.ManyToManyField('Tag', null=True)
	created = models.TimeField(auto_now_add=True)

	class Meta:
		verbose_name_plural = "Points of Interest"

class AvailableLanguage(NamedModel):
	pass

class City(NamedModel):
	class Meta:
		verbose_name_plural = "Cities"

class Reviewer(NamedModel):
	pass

class Tag(NamedModel):
	pass

class Review(models.Model):
	text = models.TextField()
	date = models.TimeField(auto_now_add=True)
	reviewer = models.ForeignKey('Reviewer')
	poi = models.ForeignKey('PointOfInterest', related_name="reviews")

	def __str__(self):
		return '%s - %s' % (self.poi.name, self.reviewer.name)

	class Meta:
		unique_together = (('reviewer', 'poi'),)

class NameTranslation(NamedModel):
	language = models.ForeignKey('AvailableLanguage')
	poi_name = models.ForeignKey('PointOfInterest')

