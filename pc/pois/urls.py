from django.conf.urls import url, include
from . import views
from models import PointOfInterest, Tag
from django.db.models import Count

from rest_framework import routers, serializers, viewsets

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


#Viewset for POIS - return an augmented serializer and queryset for the list view so that
#we can include the review count
class POIViewSet(viewsets.ModelViewSet):
    serializer_class = POISerializer
    queryset = PointOfInterest.objects.all()

    def get_serializer_class(self):
      if self.action is 'list':
        return POIListSerializer

      return POISerializer

    def get_queryset(self):
      queryset = PointOfInterest.objects.all().select_related('city').prefetch_related('tags')
      if self.action is 'list':
        queryset.annotate(num_reviews=Count('reviews'))

      search = self.request.query_params.get('search', None)
      if search is not None:
        queryset = queryset.filter(name__icontains=search)
      return queryset


class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all().order_by('name')
    serializer_class = TagSerializer

# Routers provide an easy way of automatically determining the URL conf.
router = routers.DefaultRouter()
router.register(r'pois', POIViewSet)
router.register(r'tags', TagViewSet)

urlpatterns = [
  url(r'^api/', include(router.urls)),
	url(r'^$', views.index, name='index'),
]
