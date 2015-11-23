from django.conf.urls import url, include

from . import views
from viewsets import POIViewSet, TagViewSet

from rest_framework import routers


# Routers provide an easy way of automatically determining the URL conf.
router = routers.DefaultRouter()
router.register(r'pois', POIViewSet)
router.register(r'tags', TagViewSet)

urlpatterns = [
  url(r'^api/', include(router.urls)),
	url(r'^$', views.index, name='index'),
]
