from django.conf.urls import url, include
from . import views
from models import PointOfInterest

from rest_framework import routers, serializers, viewsets

# Serializers define the API representation.
class POISerializer(serializers.ModelSerializer):
    class Meta:
        model = PointOfInterest

# ViewSets define the view behavior.
class POIViewSet(viewsets.ModelViewSet):
    queryset = PointOfInterest.objects.all()
    serializer_class = POISerializer

# Routers provide an easy way of automatically determining the URL conf.
router = routers.DefaultRouter()
router.register(r'pois', POIViewSet)

urlpatterns = [
    url(r'^api/', include(router.urls)),
	url(r'^$', views.index, name='index'),
]


#if settings.DEBUG:
#    urlpatterns += url(
#        r'^$', 'django.contrib.staticfiles.views.serve', kwargs={
#            'path': '/app/dist/index.html'}),

