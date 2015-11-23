from serializers import POISerializer, TagSerializer, POIListSerializer
from models import PointOfInterest, Tag
from django.db.models import Count

from rest_framework import viewsets

#Viewset for POIS - return an augmented serializer and queryset for the list view so that
#we can include the review count
class POIViewSet(viewsets.ModelViewSet):
    queryset = PointOfInterest.objects.all()

    def get_serializer_class(self):
      if self.action == 'list':
        return POIListSerializer
      else:
        return POISerializer

    def get_queryset(self):
      queryset = PointOfInterest.objects.all().select_related('city').prefetch_related('tags')
      if self.action == 'list':
        queryset = queryset.annotate(num_reviews=Count('reviews'))

      search = self.request.query_params.get('search', None)
      if search is not None:
        queryset = queryset.filter(name__icontains=search)
      return queryset


class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer