<template>
    <q-layout>
        <q-page-container>
            <div id="explore-map" class="row">
              <div class="example-custom-control q-mt-md zoom-controls">
                  <span class="q-mr-sm q-pa-sm bg-zoom-scale shadow-2" style="border-radius: 50%; padding: 10px 9.5px 10px 9.5px" v-wave="{ color: '#bbbbbb', initialOpacity: 0.5, easing: 'ease-in', duration: 0.3 }" @click="zoomScale++">&#10133;</span>
                  <span class="q-pa-sm bg-zoom-scale shadow-2" style="border-radius: 50%; padding: 10px 9.5px 10px 9.5px" v-wave="{ color: '#bbbbbb', initialOpacity: 0.5, easing: 'ease-in', duration: 0.3 }" @click="zoomScale--">&#10134;</span>
              </div>
              <l-map
                :zoom="zoomScale"
                :center="center"
                :options="mapOptions"
                style="height: 334px;"
                @update:center="centerUpdate"
                @ready="readyMap"
                @click="removePopUpinfo"
                @move="removePopUpinfo"
                @update:zoom="zoomUpdate"
                @update:bounds="udpateQuestList"
                ref="myPurelyPeerMap"
              >
                <!-- <l-control-zoom position="bottomright"></l-control-zoom> -->

                <l-tile-layer :url="url" :attribution="attribution" />

                <l-marker :icon="icon" :lat-lng="markerLocation"></l-marker>

                <l-marker v-for="(mark, markerIndex) in quests" :key="markerIndex+'marker'"
                :lat-lng="mark.coors" :ref="'markerIndexer'+markerIndex" @click="toggleWindowInfo(markerIndex)">
                    <l-popup :options="popUpOptions" @remove="removePopUpinfo" ref="pops">
                        <div class="infowindow">
                            <p>Quest Name: <span class="text-weight-bold">{{ mark.name }}</span></p>
                            <p>PurelyPeer Tier: <span class="text-weight-bold">{{ (mark.acceptance_tier).charAt(0).toUpperCase()+(mark.acceptance_tier).slice(1) }}</span></p>
                            <p>X/Y: <span class="text-weight-bold">{{ mark.cashdrops_remaining + '/' + mark.total_cashdrops }}</span></p>
                        </div>
                    </l-popup>
                    <l-icon
                        :icon-size="[mark.active === true ? 30 : 50, mark.active === true ? 40 : 50]"
                        :icon-anchor="[mark.active === true ? 1 : 12, mark.active === true ? 40 : 44]"
                        :icon-url="(mark.active === true ? (mark.acceptance_tier === 'Upcoming' ? 'PurelyPeer-location-blue.png' : (mark.acceptance_tier === 'Direct' ? 'PurelyPeer-location-green.png' : 'PurelyPeer-location-orange.png')) : 'PurelyPeer-icon-black.png')" />
                </l-marker>

                <!-- <l-marker :lat-lng="cashDropCoor.coors" v-for="(cashDropCoor, cashDropsIndex) in cashDropsCoordinates" :key="cashDropsIndex+'dropMarker'">
                    <l-icon
                        :icon-size="[30, 30]"
                        :icon-anchor="[15, 15]"
                        :icon-url="'PurelyPeer-location-current-B.png'" />
                </l-marker> -->

                <l-circle
                    v-for="(pin, index) in quests" :key="index"
                    :lat-lng="pin.coors"
                    :radius="pin.radius"
                    :color="circle.color"
                    :fillColor="circle.fillColor"
                    :weight="1"
                    :visible="pin.radiusVisibility"
                    @click="toggleWindowInfo(index)" />
              </l-map>
              <!-- <div class="adjust-map-height q-px-md">
                  <q-btn color="btn-map-resizer text-btn-color" rounded v-touch-pan.vertical.prevent.mouse="resizeMapHeight" size="sm" label="Pinch to resize" />
              </div> -->
              <div class="current-location">
                <q-btn class="q-px-none" color="btn-map-resizer text-btn-color" icon="my_location" round @click="currentLocation" size="sm" />
              </div>
            </div>
        </q-page-container>
    </q-layout>
</template>

<script>
import { Plugins } from '@capacitor/core'
import { latLng, icon } from 'leaflet'
import { LMap, LTileLayer, LMarker, LCircle, LPopup, LIcon } from 'vue2-leaflet'
import 'leaflet/dist/leaflet.css'

const { Geolocation } = Plugins

export default {
  name: 'Explore-map',
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LCircle,
    LPopup,
    LIcon
  },
  data () {
    return {
      zoomScale: 13,
      url: 'https://{s}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png',
      attribution: '©OpenStreetMap, ©CartoDB',
      mapOptions: {
        zoomSnap: 0.5,
        closePopupOnClick: true,
        zoomControl: false,
        inertia: true
      },
      popUpOptions: {
        autoPan: false,
        maxWidth: 250
      },
      center: latLng(0, 0),
      icon: icon({
        iconUrl: 'PurelyPeer-location-current-A.png',
        iconSize: [80, 80],
        iconAnchor: [40, 54]
      }),
      markerLocation: latLng(0, 0),
      circle: {
        color: '#0AC18E',
        fillColor: 'transparent'
      },
      quests: null,
      activeIndex: 0,
      // cashDropsCoordinates: null,
      startY: 0,
      counter: 0,
      mapHeight: 0,
      hover: false,
      questRadius: null,
      bounds: null
    }
  },
  props: ['moveToTheQuestCoordinates'],
  watch: {
    moveToTheQuestCoordinates () {
      const coors = this.moveToTheQuestCoordinates.coors
      this.questRadius = this.moveToTheQuestCoordinates.radius
      this.center = coors

      // Zoom in based on the radius
      setTimeout(() => {
        if (this.questRadius === 1500) {
          this.zoomScale = 14
        } else if (this.questRadius === 15000) {
          this.zoomScale = 10
        } else if (this.questRadius === 150000) {
          this.zoomScale = 7
        } else {
          this.zoomScale = 4
        }
      }, 1000)

      // Closes the popup and radius of other quest
      this.quests[this.activeIndex].radiusVisibility = false
      this.$refs['markerIndexer' + this.activeIndex][0].mapObject.closePopup()

      // Show the popup after zooming in
      setTimeout(() => {
        this.$refs['markerIndexer' + this.moveToTheQuestCoordinates.index][0].mapObject.openPopup()
        this.quests[this.moveToTheQuestCoordinates.index].radiusVisibility = true
      }, 2000)

      this.activeIndex = this.moveToTheQuestCoordinates.index !== undefined ? this.moveToTheQuestCoordinates.index : this.activeIndex

      this.removePopUpinfo()
    }
  },
  methods: {
    currentLocation () {
      this.center = this.markerLocation
    },
    zoomUpdate (scale) {
      this.zoomScale = scale
    },
    centerUpdate (center) {
      this.center = center
    },
    readyMap () {
      Geolocation.getCurrentPosition().then(position => {
        const coors = latLng(
          position.coords.latitude,
          position.coords.longitude
        )
        console.log(coors)
        this.center = coors
        this.circle.center = coors
        this.markerLocation = coors
      }).catch(error => {
        this.zoomScale = 1
        console.log('Unable to retreive your location: ', error)
      })
    },
    toggleWindowInfo (infoIndex) {
      if (this.activeIndex !== infoIndex) {
        this.quests[this.activeIndex].radiusVisibility = false
      }
      this.quests[infoIndex].infoWinOpen = !this.quests[infoIndex].infoWinOpen
      this.quests[infoIndex].radiusVisibility = !this.quests[infoIndex].radiusVisibility
      // this.cashDropsCoordinates = this.quests[infoIndex].infoWinOpen === true ? this.quests[infoIndex].cashdrops : ''
      this.activeIndex = infoIndex
    },
    removePopUpinfo () {
      if (this.quests !== null) {
        if (this.quests[this.activeIndex].infoWinOpen === true) {
          document.getElementsByClassName('leaflet-popup-close-button')[0].click()
        }
        this.quests[this.activeIndex].infoWinOpen = false
        this.quests[this.activeIndex].radiusVisibility = false
        // this.cashDropsCoordinates = null
        this.$refs['markerIndexer' + this.activeIndex][0].mapObject.closePopup()
      }

      // this.markerLocation = this.$refs.myPurelyPeerMap.mapObject.getCenter()
    },
    resizeMapHeight ({ evt, ...info }) {
      const map = this.$refs.myPurelyPeerMap.$el
      if (this.counter === 0) {
        this.mapHeight = parseInt(document.defaultView.getComputedStyle(map).height, 10)
        this.startY = Math.round(evt.changedTouches[0].screenY)
      }
      if (!info.isFinal) {
        this.counter++
      } else {
        this.counter = 0
      }
      this.doResize(event)
    },
    doResize (e) {
      const map = this.$refs.myPurelyPeerMap
      const newHeight = this.mapHeight + e.changedTouches[0].screenY - this.startY
      const minMapHeight = 334

      if (((80 / 100) * window.innerHeight) >= newHeight) {
        if (newHeight >= minMapHeight) {
          map.$el.style.height = newHeight + 'px'
        }
      }
      this.$refs.myPurelyPeerMap.mapObject.invalidateSize()
    },
    udpateQuestList (bounds) {
      this.bounds = bounds
      console.log('Bounds: ', bounds)
    }
  },
  created () {
    Geolocation.getCurrentPosition()
      .then(position => {
      }).catch(error => {
        this.zoomScale = 1
        console.log('Unable to retreive your location: ', error)
      })
  },
  async mounted () {
    await this.$store.dispatch('cashdrop/fetchQuestList').then(res => {
      console.log('Response: ', res)
      this.quests = res.data.results.length > 0 ? res.data.results.map(quest => ({ ...quest, infoWinOpen: false, radiusVisibility: false })) : ''
    }).catch(err => {
      console.error('Error: ', err)
    })
  }
}
</script>

<style scoped>
.infowindow p {
    color: #676767;
    margin: 0;
}
.zoom-controls {
    position: absolute;
    right: 10px;
    bottom: 26px;
    z-index: 1000;
}
.zoom-controls span {
    cursor: pointer;
    font-size: 10px;
    z-index: 1000;
}
.q-layout--standard {
    min-height: 334px !important;
}
.adjust-map-height {
    position: absolute;
    padding: 0;
    right: 80px;
    bottom: 18px;
    z-index: 1000;
}
.current-location {
    position: absolute;
    left: 8px;
    bottom: 18px;
    z-index: 1000;
}
.bg-btn-map-resizer {
    background-color: rgba(255, 255, 255, 0.4);
    box-shadow: none !important;
}
.text-btn-color {
    color: rgba(0, 0, 0, 0.7) !important;
}
.btn-zoom-scale {
  background: rgba(255, 255, 255, 0.4);
}
</style>
