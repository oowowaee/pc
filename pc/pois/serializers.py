from models import PointOfInterest, Tag

from rest_framework import serializers

class POISerializer(serializers.ModelSerializer):
	city = serializers.StringRelatedField()
	tags = serializers.StringRelatedField(many=True)

	class Meta:
		model = PointOfInterest


#Add the total number of reviews to the basic serializer for a POI
class POIListSerializer(POISerializer):
    num_reviews = serializers.IntegerField()

class TagSerializer(serializers.ModelSerializer):
	class Meta:
		model = Tag
