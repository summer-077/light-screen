<template>
    <div id="app">
        <dv-border-box-11 :titleWidth="500" class="border11" title="莱恩高科智慧路灯大数据平台" z-index="0">
            <div class="front" z-index="20">

                <span class="logout" @click="handleLogout"> 退出</span>
                  <!-- <div class="mode_choose">
                  <el-tooltip class="item" effect="dark" :content="manual_content" placement="top-start">
                    <div class="manual_mode" @click="watch('manual')"
                    style="padding:0 10px 0 10px;"
                    >手动</div>
                  </el-tooltip>
                  <el-switch
                    v-model="modeChoose"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    :width="60"
                    :disabled="ifGuest"
                    @change="handleModeChoose"
                  ></el-switch>
                  <el-tooltip class="item" effect="dark" :content="auto_content" placement="top">
                    <div class="auto_mode" 
                    @click="watch('auto')"
                    style="padding:0 10px 0 10px;"
                    >自动</div>
                  </el-tooltip>
                </div> -->
            </div>
            <baidu-map class="map" :center="center" :zoom="zoom" @ready="init" :load="load" :max-zoom="maxZoom"
                :min-zoom="minZoom" :scroll-wheel-zoom="true" :mapStyle="mapStyle" z-index="-55"
                animation="BMAP_ANIMATION_BOUNCE">
                <bm-marker 
                v-for="item in marker" 
                :position="{ lng: item.lng, lat: item.lat }"
                :icon="{url: pointimg, size: {width: 35, height: 35}}"
                @click="infoWindowOpen">
                    <bm-info-window :show="show" @close="infoWindowClose"
                        @open="infoWindowOpen">路灯数量：{{ marker.length }}</bm-info-window>
                </bm-marker>
            </baidu-map>
            <MainView @change="on_change" @ifInWork="ifInWork" @loadVisible="loadVisible" ref="MainView"></MainView>
        </dv-border-box-11>
        <div class="load" v-if="ifloading" z-index="999">
            <dv-loading>
                <div class="loading">Loading...</div>
            </dv-loading>
        </div>
    </div>
</template>
  
<script >
import MainView from '../views/MainView.vue'
export default {
    components: { MainView },
    data() {
        return {
            mapinit: null,
            light_socket: null,
            show: false,
            lightTable: [],
            routerpoint: [],
            marker: [],
            maxZoom: 20,
            minZoom: 17,
            zoom: 18,
            ifloading: true,
            item: 6,
            pointimg:'http://43.139.95.60:4009/work.png',
            street: [],//统计道路
            center: { lng: 113.989098, lat: 23.57457 },
            manual_content:'开启手动模式后，自动模式设置被禁用，点击手动进入页面，可以控制路灯的开关以及亮度调节',
      auto_content:'开启高级模式后，手动模式被禁用，点击高级进入页面，高级模式下可以设置高亮度低亮度占比等参数',
            mapStyle: {
                styleJson: [{
                    "featureType": "land",
                    "elementType": "geometry",
                    "stylers": {
                        "visibility": "on",
                        "color": "#091220ff"
                    }
                }, {
                    "featureType": "water",
                    "elementType": "geometry",
                    "stylers": {
                        "visibility": "on",
                        "color": "#113549ff"
                    }
                }, {
                    "featureType": "green",
                    "elementType": "geometry",
                    "stylers": {
                        "visibility": "on",
                        "color": "#0e1b30ff"
                    }
                }, {
                    "featureType": "building",
                    "elementType": "geometry",
                    "stylers": {
                        "visibility": "off"
                    }
                }, {
                    "featureType": "building",
                    "elementType": "geometry.topfill",
                    "stylers": {
                        "color": "#113549ff"
                    }
                }, {
                    "featureType": "building",
                    "elementType": "geometry.sidefill",
                    "stylers": {
                        "color": "#143e56ff"
                    }
                }, {
                    "featureType": "building",
                    "elementType": "geometry.stroke",
                    "stylers": {
                        "color": "#dadada00"
                    }
                }, {
                    "featureType": "subwaystation",
                    "elementType": "geometry",
                    "stylers": {
                        "visibility": "on",
                        "color": "#113549B2"
                    }
                }, {
                    "featureType": "education",
                    "elementType": "geometry",
                    "stylers": {
                        "visibility": "on",
                        "color": "#12223dff"
                    }
                }, {
                    "featureType": "medical",
                    "elementType": "geometry",
                    "stylers": {
                        "visibility": "on",
                        "color": "#12223dff"
                    }
                }, {
                    "featureType": "scenicspots",
                    "elementType": "geometry",
                    "stylers": {
                        "visibility": "on",
                        "color": "#12223dff"
                    }
                }, {
                    "featureType": "highway",
                    "elementType": "geometry",
                    "stylers": {
                        "visibility": "on",
                        "weight": "4"
                    }
                }, {
                    "featureType": "highway",
                    "elementType": "geometry.fill",
                    "stylers": {
                        "color": "#12223dff"
                    }
                }, {
                    "featureType": "highway",
                    "elementType": "geometry.stroke",
                    "stylers": {
                        "color": "#fed66900"
                    }
                }, {
                    "featureType": "highway",
                    "elementType": "labels",
                    "stylers": {
                        "visibility": "on"
                    }
                }, {
                    "featureType": "highway",
                    "elementType": "labels.text.fill",
                    "stylers": {
                        "color": "#12223dff"
                    }
                }, {
                    "featureType": "highway",
                    "elementType": "labels.text.stroke",
                    "stylers": {
                        "color": "#ffffff00"
                    }
                }, {
                    "featureType": "highway",
                    "elementType": "labels.icon",
                    "stylers": {
                        "visibility": "on"
                    }
                }, {
                    "featureType": "arterial",
                    "elementType": "geometry",
                    "stylers": {
                        "visibility": "on",
                        "weight": "2"
                    }
                }, {
                    "featureType": "arterial",
                    "elementType": "geometry.fill",
                    "stylers": {
                        "color": "#12223dff"
                    }
                }, {
                    "featureType": "arterial",
                    "elementType": "geometry.stroke",
                    "stylers": {
                        "color": "#ffeebb00"
                    }
                }, {
                    "featureType": "arterial",
                    "elementType": "labels",
                    "stylers": {
                        "visibility": "on"
                    }
                }, {
                    "featureType": "arterial",
                    "elementType": "labels.text.fill",
                    "stylers": {
                        "color": "#2dc4bbff"
                    }
                }, {
                    "featureType": "arterial",
                    "elementType": "labels.text.stroke",
                    "stylers": {
                        "color": "#ffffff00"
                    }
                }, {
                    "featureType": "local",
                    "elementType": "geometry",
                    "stylers": {
                        "visibility": "on",
                        "weight": "1"
                    }
                }, {
                    "featureType": "local",
                    "elementType": "geometry.fill",
                    "stylers": {
                        "color": "#12223dff"
                    }
                }, {
                    "featureType": "local",
                    "elementType": "geometry.stroke",
                    "stylers": {
                        "color": "#ffffff00"
                    }
                }, {
                    "featureType": "local",
                    "elementType": "labels",
                    "stylers": {
                        "visibility": "on"
                    }
                }, {
                    "featureType": "local",
                    "elementType": "labels.text.fill",
                    "stylers": {
                        "color": "#979c9aff"
                    }
                }, {
                    "featureType": "local",
                    "elementType": "labels.text.stroke",
                    "stylers": {
                        "color": "#ffffffff"
                    }
                }, {
                    "featureType": "railway",
                    "elementType": "geometry",
                    "stylers": {
                        "visibility": "off"
                    }
                }, {
                    "featureType": "subway",
                    "elementType": "geometry",
                    "stylers": {
                        "visibility": "off",
                        "weight": "1"
                    }
                }, {
                    "featureType": "subway",
                    "elementType": "geometry.fill",
                    "stylers": {
                        "color": "#d8d8d8ff"
                    }
                }, {
                    "featureType": "subway",
                    "elementType": "geometry.stroke",
                    "stylers": {
                        "color": "#ffffff00"
                    }
                }, {
                    "featureType": "subway",
                    "elementType": "labels",
                    "stylers": {
                        "visibility": "on"
                    }
                }, {
                    "featureType": "subway",
                    "elementType": "labels.text.fill",
                    "stylers": {
                        "color": "#979c9aff"
                    }
                }, {
                    "featureType": "subway",
                    "elementType": "labels.text.stroke",
                    "stylers": {
                        "color": "#ffffffff"
                    }
                }, {
                    "featureType": "continent",
                    "elementType": "labels",
                    "stylers": {
                        "visibility": "on"
                    }
                }, {
                    "featureType": "continent",
                    "elementType": "labels.icon",
                    "stylers": {
                        "visibility": "on"
                    }
                }, {
                    "featureType": "continent",
                    "elementType": "labels.text.fill",
                    "stylers": {
                        "color": "#2dc4bbff"
                    }
                }, {
                    "featureType": "continent",
                    "elementType": "labels.text.stroke",
                    "stylers": {
                        "color": "#ffffff00"
                    }
                }, {
                    "featureType": "city",
                    "elementType": "labels.icon",
                    "stylers": {
                        "visibility": "off"
                    }
                }, {
                    "featureType": "city",
                    "elementType": "labels",
                    "stylers": {
                        "visibility": "on"
                    }
                }, {
                    "featureType": "city",
                    "elementType": "labels.text.fill",
                    "stylers": {
                        "color": "#2dc4bbff"
                    }
                }, {
                    "featureType": "city",
                    "elementType": "labels.text.stroke",
                    "stylers": {
                        "color": "#ffffff00"
                    }
                }, {
                    "featureType": "town",
                    "elementType": "labels.icon",
                    "stylers": {
                        "visibility": "on"
                    }
                }, {
                    "featureType": "town",
                    "elementType": "labels",
                    "stylers": {
                        "visibility": "off"
                    }
                }, {
                    "featureType": "town",
                    "elementType": "labels.text.fill",
                    "stylers": {
                        "color": "#454d50ff"
                    }
                }, {
                    "featureType": "town",
                    "elementType": "labels.text.stroke",
                    "stylers": {
                        "color": "#ffffffff"
                    }
                }, {
                    "featureType": "road",
                    "elementType": "geometry.fill",
                    "stylers": {
                        "color": "#12223dff"
                    }
                }, {
                    "featureType": "poilabel",
                    "elementType": "labels",
                    "stylers": {
                        "visibility": "on"
                    }
                }, {
                    "featureType": "districtlabel",
                    "elementType": "labels",
                    "stylers": {
                        "visibility": "off"
                    }
                }, {
                    "featureType": "road",
                    "elementType": "geometry",
                    "stylers": {
                        "visibility": "on"
                    }
                }, {
                    "featureType": "road",
                    "elementType": "labels",
                    "stylers": {
                        "visibility": "off"
                    }
                }, {
                    "featureType": "road",
                    "elementType": "geometry.stroke",
                    "stylers": {
                        "color": "#ffffff00"
                    }
                }, {
                    "featureType": "district",
                    "elementType": "labels",
                    "stylers": {
                        "visibility": "on"
                    }
                }, {
                    "featureType": "poilabel",
                    "elementType": "labels.icon",
                    "stylers": {
                        "visibility": "off"
                    }
                }, {
                    "featureType": "poilabel",
                    "elementType": "labels.text.fill",
                    "stylers": {
                        "color": "#2dc4bbff"
                    }
                }, {
                    "featureType": "poilabel",
                    "elementType": "labels.text.stroke",
                    "stylers": {
                        "color": "#ffffff00"
                    }
                }, {
                    "featureType": "manmade",
                    "elementType": "geometry",
                    "stylers": {
                        "color": "#12223dff"
                    }
                }, {
                    "featureType": "districtlabel",
                    "elementType": "labels.text.stroke",
                    "stylers": {
                        "color": "#ffffffff"
                    }
                }, {
                    "featureType": "entertainment",
                    "elementType": "geometry",
                    "stylers": {
                        "color": "#12223dff"
                    }
                }, {
                    "featureType": "shopping",
                    "elementType": "geometry",
                    "stylers": {
                        "color": "#12223dff"
                    }
                }, {
                    "featureType": "nationalway",
                    "stylers": {
                        "level": "6",
                        "curZoomRegionId": "0",
                        "curZoomRegion": "6-10"
                    }
                }, {
                    "featureType": "nationalway",
                    "stylers": {
                        "level": "7",
                        "curZoomRegionId": "0",
                        "curZoomRegion": "6-10"
                    }
                }, {
                    "featureType": "nationalway",
                    "stylers": {
                        "level": "8",
                        "curZoomRegionId": "0",
                        "curZoomRegion": "6-10"
                    }
                }, {
                    "featureType": "nationalway",
                    "stylers": {
                        "level": "9",
                        "curZoomRegionId": "0",
                        "curZoomRegion": "6-10"
                    }
                }, {
                    "featureType": "nationalway",
                    "stylers": {
                        "level": "10",
                        "curZoomRegionId": "0",
                        "curZoomRegion": "6-10"
                    }
                }, {
                    "featureType": "nationalway",
                    "elementType": "geometry",
                    "stylers": {
                        "visibility": "off",
                        "level": "6",
                        "curZoomRegionId": "0",
                        "curZoomRegion": "6-10"
                    }
                }, {
                    "featureType": "nationalway",
                    "elementType": "geometry",
                    "stylers": {
                        "visibility": "off",
                        "level": "7",
                        "curZoomRegionId": "0",
                        "curZoomRegion": "6-10"
                    }
                }, {
                    "featureType": "nationalway",
                    "elementType": "geometry",
                    "stylers": {
                        "visibility": "off",
                        "level": "8",
                        "curZoomRegionId": "0",
                        "curZoomRegion": "6-10"
                    }
                }, {
                    "featureType": "nationalway",
                    "elementType": "geometry",
                    "stylers": {
                        "visibility": "off",
                        "level": "9",
                        "curZoomRegionId": "0",
                        "curZoomRegion": "6-10"
                    }
                }, {
                    "featureType": "nationalway",
                    "elementType": "geometry",
                    "stylers": {
                        "visibility": "off",
                        "level": "10",
                        "curZoomRegionId": "0",
                        "curZoomRegion": "6-10"
                    }
                }, {
                    "featureType": "nationalway",
                    "elementType": "labels",
                    "stylers": {
                        "visibility": "off",
                        "level": "6",
                        "curZoomRegionId": "0",
                        "curZoomRegion": "6-10"
                    }
                }, {
                    "featureType": "nationalway",
                    "elementType": "labels",
                    "stylers": {
                        "visibility": "off",
                        "level": "7",
                        "curZoomRegionId": "0",
                        "curZoomRegion": "6-10"
                    }
                }, {
                    "featureType": "nationalway",
                    "elementType": "labels",
                    "stylers": {
                        "visibility": "off",
                        "level": "8",
                        "curZoomRegionId": "0",
                        "curZoomRegion": "6-10"
                    }
                }, {
                    "featureType": "nationalway",
                    "elementType": "labels",
                    "stylers": {
                        "visibility": "off",
                        "level": "9",
                        "curZoomRegionId": "0",
                        "curZoomRegion": "6-10"
                    }
                }, {
                    "featureType": "nationalway",
                    "elementType": "labels",
                    "stylers": {
                        "visibility": "off",
                        "level": "10",
                        "curZoomRegionId": "0",
                        "curZoomRegion": "6-10"
                    }
                }, {
                    "featureType": "cityhighway",
                    "stylers": {
                        "level": "6",
                        "curZoomRegionId": "0",
                        "curZoomRegion": "6-9"
                    }
                }, {
                    "featureType": "cityhighway",
                    "stylers": {
                        "level": "7",
                        "curZoomRegionId": "0",
                        "curZoomRegion": "6-9"
                    }
                }, {
                    "featureType": "cityhighway",
                    "stylers": {
                        "level": "8",
                        "curZoomRegionId": "0",
                        "curZoomRegion": "6-9"
                    }
                }, {
                    "featureType": "cityhighway",
                    "stylers": {
                        "level": "9",
                        "curZoomRegionId": "0",
                        "curZoomRegion": "6-9"
                    }
                }, {
                    "featureType": "cityhighway",
                    "elementType": "geometry",
                    "stylers": {
                        "visibility": "off",
                        "level": "6",
                        "curZoomRegionId": "0",
                        "curZoomRegion": "6-9"
                    }
                }, {
                    "featureType": "cityhighway",
                    "elementType": "geometry",
                    "stylers": {
                        "visibility": "off",
                        "level": "7",
                        "curZoomRegionId": "0",
                        "curZoomRegion": "6-9"
                    }
                }, {
                    "featureType": "cityhighway",
                    "elementType": "geometry",
                    "stylers": {
                        "visibility": "off",
                        "level": "8",
                        "curZoomRegionId": "0",
                        "curZoomRegion": "6-9"
                    }
                }, {
                    "featureType": "cityhighway",
                    "elementType": "geometry",
                    "stylers": {
                        "visibility": "off",
                        "level": "9",
                        "curZoomRegionId": "0",
                        "curZoomRegion": "6-9"
                    }
                }, {
                    "featureType": "cityhighway",
                    "elementType": "labels",
                    "stylers": {
                        "visibility": "off",
                        "level": "6",
                        "curZoomRegionId": "0",
                        "curZoomRegion": "6-9"
                    }
                }, {
                    "featureType": "cityhighway",
                    "elementType": "labels",
                    "stylers": {
                        "visibility": "off",
                        "level": "7",
                        "curZoomRegionId": "0",
                        "curZoomRegion": "6-9"
                    }
                }, {
                    "featureType": "cityhighway",
                    "elementType": "labels",
                    "stylers": {
                        "visibility": "off",
                        "level": "8",
                        "curZoomRegionId": "0",
                        "curZoomRegion": "6-9"
                    }
                }, {
                    "featureType": "cityhighway",
                    "elementType": "labels",
                    "stylers": {
                        "visibility": "off",
                        "level": "9",
                        "curZoomRegionId": "0",
                        "curZoomRegion": "6-9"
                    }
                }, {
                    "featureType": "subwaylabel",
                    "elementType": "labels",
                    "stylers": {
                        "visibility": "off"
                    }
                }, {
                    "featureType": "subwaylabel",
                    "elementType": "labels.icon",
                    "stylers": {
                        "visibility": "off"
                    }
                }, {
                    "featureType": "tertiarywaysign",
                    "elementType": "labels",
                    "stylers": {
                        "visibility": "off"
                    }
                }, {
                    "featureType": "tertiarywaysign",
                    "elementType": "labels.icon",
                    "stylers": {
                        "visibility": "off"
                    }
                }, {
                    "featureType": "provincialwaysign",
                    "elementType": "labels",
                    "stylers": {
                        "visibility": "off"
                    }
                }, {
                    "featureType": "provincialwaysign",
                    "elementType": "labels.icon",
                    "stylers": {
                        "visibility": "off"
                    }
                }, {
                    "featureType": "nationalwaysign",
                    "elementType": "labels",
                    "stylers": {
                        "visibility": "off"
                    }
                }, {
                    "featureType": "nationalwaysign",
                    "elementType": "labels.icon",
                    "stylers": {
                        "visibility": "off"
                    }
                }, {
                    "featureType": "highwaysign",
                    "elementType": "labels",
                    "stylers": {
                        "visibility": "off"
                    }
                }, {
                    "featureType": "highwaysign",
                    "elementType": "labels.icon",
                    "stylers": {
                        "visibility": "off"
                    }
                }, {
                    "featureType": "village",
                    "elementType": "labels",
                    "stylers": {
                        "visibility": "off"
                    }
                }, {
                    "featureType": "district",
                    "elementType": "labels.text",
                    "stylers": {
                        "fontsize": "20"
                    }
                }, {
                    "featureType": "district",
                    "elementType": "labels.text.fill",
                    "stylers": {
                        "color": "#2dc4bbff"
                    }
                }, {
                    "featureType": "district",
                    "elementType": "labels.text.stroke",
                    "stylers": {
                        "color": "#ffffff00"
                    }
                }, {
                    "featureType": "country",
                    "elementType": "labels.text.fill",
                    "stylers": {
                        "color": "#2dc4bbff"
                    }
                }, {
                    "featureType": "country",
                    "elementType": "labels.text.stroke",
                    "stylers": {
                        "color": "#ffffff00"
                    }
                }, {
                    "featureType": "water",
                    "elementType": "labels.text.fill",
                    "stylers": {
                        "color": "#2dc4bbff"
                    }
                }, {
                    "featureType": "water",
                    "elementType": "labels.text.stroke",
                    "stylers": {
                        "color": "#ffffff00"
                    }
                }, {
                    "featureType": "cityhighway",
                    "elementType": "geometry.fill",
                    "stylers": {
                        "color": "#12223dff"
                    }
                }, {
                    "featureType": "cityhighway",
                    "elementType": "geometry.stroke",
                    "stylers": {
                        "color": "#ffffff00"
                    }
                }, {
                    "featureType": "tertiaryway",
                    "elementType": "geometry.fill",
                    "stylers": {
                        "color": "#12223dff"
                    }
                }, {
                    "featureType": "tertiaryway",
                    "elementType": "geometry.stroke",
                    "stylers": {
                        "color": "#ffffff10"
                    }
                }, {
                    "featureType": "provincialway",
                    "elementType": "geometry.fill",
                    "stylers": {
                        "color": "#12223dff"
                    }
                }, {
                    "featureType": "provincialway",
                    "elementType": "geometry.stroke",
                    "stylers": {
                        "color": "#ffffff00"
                    }
                }, {
                    "featureType": "nationalway",
                    "elementType": "geometry.fill",
                    "stylers": {
                        "color": "#12223dff"
                    }
                }, {
                    "featureType": "nationalway",
                    "elementType": "geometry.stroke",
                    "stylers": {
                        "color": "#ffffff00"
                    }
                }, {
                    "featureType": "highway",
                    "elementType": "labels.text",
                    "stylers": {
                        "fontsize": "20"
                    }
                }, {
                    "featureType": "nationalway",
                    "elementType": "labels.text.stroke",
                    "stylers": {
                        "color": "#ffffff00"
                    }
                }, {
                    "featureType": "nationalway",
                    "elementType": "labels.text.fill",
                    "stylers": {
                        "color": "#12223dff"
                    }
                }, {
                    "featureType": "nationalway",
                    "elementType": "labels.text",
                    "stylers": {
                        "fontsize": "20"
                    }
                }, {
                    "featureType": "provincialway",
                    "elementType": "labels.text.fill",
                    "stylers": {
                        "color": "#12223dff"
                    }
                }, {
                    "featureType": "provincialway",
                    "elementType": "labels.text.stroke",
                    "stylers": {
                        "color": "#ffffff00"
                    }
                }, {
                    "featureType": "provincialway",
                    "elementType": "labels.text",
                    "stylers": {
                        "fontsize": "20"
                    }
                }, {
                    "featureType": "cityhighway",
                    "elementType": "labels.text.fill",
                    "stylers": {
                        "color": "#12223dff"
                    }
                }, {
                    "featureType": "cityhighway",
                    "elementType": "labels.text",
                    "stylers": {
                        "fontsize": "20"
                    }
                }, {
                    "featureType": "cityhighway",
                    "elementType": "labels.text.stroke",
                    "stylers": {
                        "color": "#ffffff00"
                    }
                }, {
                    "featureType": "estate",
                    "elementType": "geometry",
                    "stylers": {
                        "opacity": "00"
                    }
                }, {
                    "featureType": "tertiaryway",
                    "elementType": "labels.text.fill",
                    "stylers": {
                        "color": "#2dc4bbff"
                    }
                }, {
                    "featureType": "tertiaryway",
                    "elementType": "labels.text.stroke",
                    "stylers": {
                        "color": "#ffffff00"
                    }
                }, {
                    "featureType": "fourlevelway",
                    "elementType": "labels.text.fill",
                    "stylers": {
                        "color": "#2dc4bbff"
                    }
                }, {
                    "featureType": "fourlevelway",
                    "elementType": "labels.text.stroke",
                    "stylers": {
                        "color": "#ffffff00"
                    }
                }, {
                    "featureType": "scenicspotsway",
                    "elementType": "geometry.fill",
                    "stylers": {
                        "color": "#12223dff"
                    }
                }, {
                    "featureType": "scenicspotsway",
                    "elementType": "geometry.stroke",
                    "stylers": {
                        "color": "#ffffff00"
                    }
                }, {
                    "featureType": "universityway",
                    "elementType": "geometry.fill",
                    "stylers": {
                        "color": "#12223dff"
                    }
                }, {
                    "featureType": "universityway",
                    "elementType": "geometry.stroke",
                    "stylers": {
                        "color": "#ffffff00"
                    }
                }, {
                    "featureType": "vacationway",
                    "elementType": "geometry.fill",
                    "stylers": {
                        "color": "#12223dff"
                    }
                }, {
                    "featureType": "vacationway",
                    "elementType": "geometry.stroke",
                    "stylers": {
                        "color": "#ffffff00"
                    }
                }, {
                    "featureType": "fourlevelway",
                    "elementType": "geometry",
                    "stylers": {
                        "visibility": "on"
                    }
                }, {
                    "featureType": "fourlevelway",
                    "elementType": "geometry.fill",
                    "stylers": {
                        "color": "#12223dff"
                    }
                }, {
                    "featureType": "fourlevelway",
                    "elementType": "geometry.stroke",
                    "stylers": {
                        "color": "#ffffff00"
                    }
                }, {
                    "featureType": "transportationlabel",
                    "elementType": "labels",
                    "stylers": {
                        "visibility": "on"
                    }
                }, {
                    "featureType": "transportationlabel",
                    "elementType": "labels.icon",
                    "stylers": {
                        "visibility": "off"
                    }
                }, {
                    "featureType": "transportationlabel",
                    "elementType": "labels.text.fill",
                    "stylers": {
                        "color": "#2dc4bbff"
                    }
                }, {
                    "featureType": "transportationlabel",
                    "elementType": "labels.text.stroke",
                    "stylers": {
                        "color": "#ffffff00"
                    }
                }, {
                    "featureType": "educationlabel",
                    "elementType": "labels",
                    "stylers": {
                        "visibility": "on"
                    }
                }, {
                    "featureType": "educationlabel",
                    "elementType": "labels.icon",
                    "stylers": {
                        "visibility": "off"
                    }
                }, {
                    "featureType": "educationlabel",
                    "elementType": "labels.text.fill",
                    "stylers": {
                        "color": "#2dc4bbff"
                    }
                }, {
                    "featureType": "educationlabel",
                    "elementType": "labels.text.stroke",
                    "stylers": {
                        "color": "#ffffff00"
                    }
                }, {
                    "featureType": "transportation",
                    "elementType": "geometry",
                    "stylers": {
                        "color": "#113549ff"
                    }
                }, {
                    "featureType": "airportlabel",
                    "elementType": "labels.text.fill",
                    "stylers": {
                        "color": "#2dc4bbff"
                    }
                }, {
                    "featureType": "airportlabel",
                    "elementType": "labels.text.stroke",
                    "stylers": {
                        "color": "#ffffff00"
                    }
                }, {
                    "featureType": "scenicspotslabel",
                    "elementType": "labels.text.fill",
                    "stylers": {
                        "color": "#2dc4bbff"
                    }
                }, {
                    "featureType": "scenicspotslabel",
                    "elementType": "labels.text.stroke",
                    "stylers": {
                        "color": "#ffffff00"
                    }
                }, {
                    "featureType": "medicallabel",
                    "elementType": "labels.text.fill",
                    "stylers": {
                        "color": "#2dc4bbff"
                    }
                }, {
                    "featureType": "medicallabel",
                    "elementType": "labels.text.stroke",
                    "stylers": {
                        "color": "#ffffff00"
                    }
                }, {
                    "featureType": "medicallabel",
                    "elementType": "labels.icon",
                    "stylers": {
                        "visibility": "off"
                    }
                }, {
                    "featureType": "scenicspotslabel",
                    "elementType": "labels.icon",
                    "stylers": {
                        "visibility": "off"
                    }
                }, {
                    "featureType": "airportlabel",
                    "elementType": "labels.icon",
                    "stylers": {
                        "visibility": "off"
                    }
                }, {
                    "featureType": "entertainmentlabel",
                    "elementType": "labels.icon",
                    "stylers": {
                        "visibility": "off"
                    }
                }, {
                    "featureType": "entertainmentlabel",
                    "elementType": "labels.text.fill",
                    "stylers": {
                        "color": "#2dc4bbff"
                    }
                }, {
                    "featureType": "entertainmentlabel",
                    "elementType": "labels.text.stroke",
                    "stylers": {
                        "color": "#ffffff00"
                    }
                }, {
                    "featureType": "estatelabel",
                    "elementType": "labels.icon",
                    "stylers": {
                        "visibility": "off"
                    }
                }, {
                    "featureType": "estatelabel",
                    "elementType": "labels.text.fill",
                    "stylers": {
                        "color": "#2dc4bbff"
                    }
                }, {
                    "featureType": "estatelabel",
                    "elementType": "labels.text.stroke",
                    "stylers": {
                        "color": "#ffffff00"
                    }
                }, {
                    "featureType": "businesstowerlabel",
                    "elementType": "labels.text.fill",
                    "stylers": {
                        "color": "#2dc4bbff"
                    }
                }, {
                    "featureType": "businesstowerlabel",
                    "elementType": "labels.text.stroke",
                    "stylers": {
                        "color": "#ffffff00"
                    }
                }, {
                    "featureType": "businesstowerlabel",
                    "elementType": "labels.icon",
                    "stylers": {
                        "visibility": "off"
                    }
                }, {
                    "featureType": "companylabel",
                    "elementType": "labels.text.fill",
                    "stylers": {
                        "color": "#2dc4bbff"
                    }
                }, {
                    "featureType": "companylabel",
                    "elementType": "labels.text.stroke",
                    "stylers": {
                        "color": "#ffffff00"
                    }
                }, {
                    "featureType": "companylabel",
                    "elementType": "labels.icon",
                    "stylers": {
                        "visibility": "off"
                    }
                }, {
                    "featureType": "governmentlabel",
                    "elementType": "labels.icon",
                    "stylers": {
                        "visibility": "on"
                    }
                }, {
                    "featureType": "governmentlabel",
                    "elementType": "labels.text.fill",
                    "stylers": {
                        "color": "#2dc4bbff"
                    }
                }, {
                    "featureType": "governmentlabel",
                    "elementType": "labels.text.stroke",
                    "stylers": {
                        "color": "#ffffff00"
                    }
                }, {
                    "featureType": "restaurantlabel",
                    "elementType": "labels.text.fill",
                    "stylers": {
                        "color": "#2dc4bbff"
                    }
                }, {
                    "featureType": "restaurantlabel",
                    "elementType": "labels.text.stroke",
                    "stylers": {
                        "color": "#ffffff00"
                    }
                }, {
                    "featureType": "restaurantlabel",
                    "elementType": "labels.icon",
                    "stylers": {
                        "visibility": "off"
                    }
                }, {
                    "featureType": "hotellabel",
                    "elementType": "labels.icon",
                    "stylers": {
                        "visibility": "off"
                    }
                }, {
                    "featureType": "hotellabel",
                    "elementType": "labels.text.fill",
                    "stylers": {
                        "color": "#2dc4bbff"
                    }
                }, {
                    "featureType": "hotellabel",
                    "elementType": "labels.text.stroke",
                    "stylers": {
                        "color": "#ffffff00"
                    }
                }, {
                    "featureType": "shoppinglabel",
                    "elementType": "labels.text.fill",
                    "stylers": {
                        "color": "#2dc4bbff"
                    }
                }, {
                    "featureType": "shoppinglabel",
                    "elementType": "labels.text.stroke",
                    "stylers": {
                        "color": "#ffffff00"
                    }
                }, {
                    "featureType": "shoppinglabel",
                    "elementType": "labels.icon",
                    "stylers": {
                        "visibility": "off"
                    }
                }, {
                    "featureType": "lifeservicelabel",
                    "elementType": "labels.text.fill",
                    "stylers": {
                        "color": "#2dc4bbff"
                    }
                }, {
                    "featureType": "lifeservicelabel",
                    "elementType": "labels.text.stroke",
                    "stylers": {
                        "color": "#ffffff00"
                    }
                }, {
                    "featureType": "lifeservicelabel",
                    "elementType": "labels.icon",
                    "stylers": {
                        "visibility": "off"
                    }
                }, {
                    "featureType": "carservicelabel",
                    "elementType": "labels.text.fill",
                    "stylers": {
                        "color": "#2dc4bbff"
                    }
                }, {
                    "featureType": "carservicelabel",
                    "elementType": "labels.text.stroke",
                    "stylers": {
                        "color": "#ffffff00"
                    }
                }, {
                    "featureType": "carservicelabel",
                    "elementType": "labels.icon",
                    "stylers": {
                        "visibility": "off"
                    }
                }, {
                    "featureType": "financelabel",
                    "elementType": "labels.text.fill",
                    "stylers": {
                        "color": "#2dc4bbff"
                    }
                }, {
                    "featureType": "financelabel",
                    "elementType": "labels.text.stroke",
                    "stylers": {
                        "color": "#ffffff00"
                    }
                }, {
                    "featureType": "financelabel",
                    "elementType": "labels.icon",
                    "stylers": {
                        "visibility": "off"
                    }
                }, {
                    "featureType": "otherlabel",
                    "elementType": "labels.text.fill",
                    "stylers": {
                        "color": "#2dc4bbff"
                    }
                }, {
                    "featureType": "otherlabel",
                    "elementType": "labels.text.stroke",
                    "stylers": {
                        "color": "#ffffff00"
                    }
                }, {
                    "featureType": "otherlabel",
                    "elementType": "labels.icon",
                    "stylers": {
                        "visibility": "off"
                    }
                }, {
                    "featureType": "manmade",
                    "elementType": "labels.text.fill",
                    "stylers": {
                        "color": "#2dc4bbff"
                    }
                }, {
                    "featureType": "manmade",
                    "elementType": "labels.text.stroke",
                    "stylers": {
                        "color": "#ffffff00"
                    }
                }, {
                    "featureType": "transportation",
                    "elementType": "labels.text.fill",
                    "stylers": {
                        "color": "#2dc4bbff"
                    }
                }, {
                    "featureType": "transportation",
                    "elementType": "labels.text.stroke",
                    "stylers": {
                        "color": "#ffffff00"
                    }
                }, {
                    "featureType": "education",
                    "elementType": "labels.text.fill",
                    "stylers": {
                        "color": "#2dc4bbff"
                    }
                }, {
                    "featureType": "education",
                    "elementType": "labels.text.stroke",
                    "stylers": {
                        "color": "#ffffff00"
                    }
                }, {
                    "featureType": "medical",
                    "elementType": "labels.text.fill",
                    "stylers": {
                        "color": "#2dc4bbff"
                    }
                }, {
                    "featureType": "medical",
                    "elementType": "labels.text.stroke",
                    "stylers": {
                        "color": "#ffffff00"
                    }
                }, {
                    "featureType": "scenicspots",
                    "elementType": "labels.text.fill",
                    "stylers": {
                        "color": "#2dc4bbff"
                    }
                }, {
                    "featureType": "scenicspots",
                    "elementType": "labels.text.stroke",
                    "stylers": {
                        "color": "#ffffff00"
                    }
                }]
            }
        };
    },
    methods: {

        infoWindowClose() {
            this.show = false
        },
        infoWindowOpen() {
            this.show = true
        },

        on_change(e) {
            this.center = e;
        },
        load(){},
        loadVisible() {
            this.ifloading = false;
         },
        init(map) {
            this.loadVisible()
            this.mapinit = map.map;
            // this.mapinit.setCenter({ lng: 113.996926, lat: 23.579383 })
        },
        // 判断工作状态更改图标
        ifInWork(url){
            this.pointimg=url
        },
 
        get_marker_list() {
            let that = this;
            // 默认值
            // that.center = { lng: 113.996926, lat: 23.579383 };
            this.light_socket = new WebSocket("ws://43.139.95.60:4006/light_ctrl");
            this.light_socket.onmessage = e => {
                let resp = JSON.parse(e.data);
                let list = resp;
                //传入选择器数据
                that.routerpoint = [];
                if (Object.keys(resp)[0] == "init_light_msg") {
                    that.marker = [];
                    that.lightTable = list["init_light_msg"];
                    // 赋值路灯坐标
                    for (var item of that.lightTable) {

                        if (item["location"] != null) {
                            // console.log(item);
                            that.marker.push({
                                lng: item["location"]["latitude"],
                                lat: item["location"]["longitude"]
                            });
                            if (!this.street.includes(item["location"]["street_id"])) {
                                this.street.push(item["location"]["street_id"])
                                this.routerpoint.push({
                                    street_id: item["location"]["street_id"],
                                    value: {
                                        lng: item["location"]["latitude"],
                                        lat: item["location"]["longitude"]
                                    },
                                    label: '依云四季',
                                })
                            }
                            // console.log("this.routerpoint",this.routerpoint);
                            // console.log("this.$refs['MainView']",this)
                            this.$refs['MainView'].set_options(this.routerpoint)

                        }
                    }
                }
            };
        },
        //   set_center() {},
        handleLogout() {
            sessionStorage.clear()
            console.log("111111");
            window.location = '/login'

        }
    },

    mounted() {
        this.get_marker_list();
    },

    created() {

        // this.init()
    }
};
</script>
  
<style lang="less">
#app {
    width: 100%;
    height: 100%;
    min-height: 600px;
    min-width: 1450px;
    background-color: rgb(9, 18, 32);
    // overflow: hidden;
    // width: 100vw;
    // position:relative;

    -moz-user-select: none;
    /*火狐*/
    -webkit-user-select: none;
    /*webkit浏览器*/
    -ms-user-select: none;
    /*IE10*/
    -khtml-user-select: none;
    /*早期浏览器*/
    user-select: none;
}

// title字体颜色和大小修改
.border11 text.dv-border-box-11-title[fill] {
    font-size: 30px;
}

.loading {
    color: aliceblue;
    font-family: "Franklin Gothic Medium";
    font-size: 2rem;
}

.load {
    background: rgb(27, 41, 66);
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.map {
    box-sizing: border-box;

    height: 100%;
    padding: 50px 20px 20px 20px;
    // position:relative;
}

html,
body {
    margin: 0px;
    padding: 0px;
    min-width: 1200px;
    height: 100%;
    overflow-y: hidden;
    /* 隐藏垂直滚动条 */
    //   overflow-x: hidden; /* 隐藏水平滚动条 */
}

// 去掉文字那行，添加CSS即可
.BMap_cpyCtrl {
    display: none;
}

// 去掉地图那行，添加CSS即可
.anchorBL img {
    width: 0px !important;
}

.front{
    width:100%;
    display:flex;
    justify-content:space-between;
    padding:0px 50px 0px 30px;
    box-sizing: border-box;
}

.logout {
    // position: absolute;
    // float: left;
    margin-left: 10px;
    font-size: 1.25rem;
    color: aliceblue
}
.mode_choose {
     // width:100%;
     padding:5px;
    position: absolute;
    right:0;
    display:flex;
    float:right;
    flex-direction: row;
    float: inline-end;
    color: #fff;
    .manual_mode,
    .auto_mode{
        cursor:pointer;
    }
}

.logout:hover {
    cursor: pointer;
}
</style>
  