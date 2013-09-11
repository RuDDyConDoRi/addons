/*  
 * Copyright (c) 2013 by GeoBolivia 
 * Author: Cristhian Ariel Choque <cristhian_ach@yahoo.es, crisxux@gmail.com, cchoque@geo.gob.bo> 
 */

Ext.namespace("GEOR.Addons");

GEOR.Addons.Insert_Coordinates = function(map, options) {
    this.options = options;
    this.map=map;
};

GEOR.Addons.Insert_Coordinates.prototype = {
    mapi: null,
    formBasic: null, 
    paneltitle: null,
    panelicon: null,
    combobox: null,
    paneldd :null,
    paneldms :null,
    panelutm :null,
    comboutm: null,
    componentImage: null,
    splitButton: null,
    optionsicon: null,
    pointer: 0,
    area: 19,
    layer:null,
     
    
    //Values ​​that will allow validating text fields
    values: {
        //Limits latitude and longitude of Bolivia Decimal degrees
        "bboxMaxLat":-9.67064, 
        "bboxMinLat":-22.91460,
        "bboxMaxLong":-57.40197,
        "bboxMinLong":-69.59113,
        //Valid values ​​range for Bolivia Degrees Minutes Seconds
        "bboxMaxLatDMS":22,
        "bboxMinLatDMS":9,
        "bboxMaxLongDMS":69,
        "bboxMinLongDMS":57,
        //Maximum and Minimum Values ​​valid for Minutes and Seconds
        "maxValueMS":59.99999,
        "minValueMS":0},
    
    //Array that stores the respective addresses of the Markers
    vecimage: [ "app/addons/insert_coordinates/img/marker1.png",
                "app/addons/insert_coordinates/img/marker2.png",
                "app/addons/insert_coordinates/img/marker3.png",
                "app/addons/insert_coordinates/img/marker4.png",
                "app/addons/insert_coordinates/img/marker5.png",
                "app/addons/insert_coordinates/img/marker6.png"],

    /**
     * Method: init
     *
     * Parameters:
     * record - {Ext.data.record} a record with the addon parameters
     */

    init: function(record) {
        var lang = OpenLayers.Lang.getCode();
        this.item = new Ext.menu.Item({
            text: record.get("title")[lang],
            iconCls: 'insert_coordinates-icon',
            qtip: record.get("description")[lang],
            handler:this.showWindow,
            scope: this
        });
        tamanio = new OpenLayers.Size(30, 30);
        offset =  new OpenLayers.Pixel(-(tamanio.w / 2), -tamanio.h);
        optionsicon = this.createOptionsIcon();
        paneltitle = this.createPanelTitle();
        splitButton = this.createSplitButton();
        componentImage = this.createComponentImage();
        panelicon = this.createPanelIcon();
        combobox = this.createComboBox();
        paneldd = this.createPanelDD().setVisible(false);
        paneldms = this.createPanelDMS().setVisible(false);
        comboutm = this.createComboUtm();
        panelutm = this.createPanelUTM().setVisible(false);
        formBasic = this.createFormBasic();
        arrMarkers = [];    //Array objects will store Markers
        arrPopups = [];     //Array objects will store Popups
        arrTitles = [];     //Array that will store each coordinate titles
        return this.item;
    },
    
    showWindow: function() {
        formBasic.getForm().reset(); //Restart the basic form.
        comboutm.setValue(19);       //combobox default UTM
        area=19;                     //keep the value variable that you selected on the combo UTM
        if (!this.win) {
            this.win = new Ext.Window({
                title : OpenLayers.i18n("title_window"),
                width : 340,
                autoHeight : true,
                constrain: true,
                resizable : false,
                x:0,
                y:32,
                id:'win',
                name:'win',
                collapsible: true,
                items : [formBasic],
                iconCls: 'insert_coordinates-icon',
                closable: true,
                closeAction: 'hide',
                buttonAlign: 'left',
                fbar: [{
                        iconCls:'help-icon',
                        scale:'medium',
                        scope: this,
                        handler : function() {
                            window.open(this.options.urlHelp);
                        }
                        },'->',{
                        xtype: 'label',
                        html: "<pre><b>Datum: WGS 84</b></pre>"
                        }]
            });
            mapi = this.map;
            this.layer = new OpenLayers.Layer.Markers("layer_markers",{
                displayInLayerSwitcher: false,
                isBaseLayer:false
            });
            mapi.addLayer(this.layer);
        }
        this.win.show();
    },
    
    createFormBasic: function() {
        return new Ext.FormPanel({
            autoHeigth : true,
            autoWidth : true,
            frame : true,
            id:'idformBasic',
            name:'idformBasic',
            border: true,
            layout: {
                type: 'table',
                columns: 1
            },
            items :[
            paneltitle,
            panelicon,{
                xtype: 'label',
                html: "<b>"+OpenLayers.i18n("coordinates")+"</b>",
                style : "display: block; padding-bottom: 10px;padding-left: 20px;"
            },
            combobox,
            paneldd,
            paneldms,
            panelutm]
        });
    },

    createPanelTitle: function() {
        return new Ext.Panel({
            bodyStyle:'padding:5px 1px 5px 60px',
            layout: {
                type: 'table',
                columns: 2
            },
            items :[{
                    xtype: 'label',
                    html: "<b>"+OpenLayers.i18n("namepoint")+" :</b>",
                    style : "display: block; padding-right: 25px;"
                },
                    new Ext.form.TextField({
                    width: 125,
                    name:'idnamepoint',
                    id:"idnamepoint",
                    maxLength : 20
                })]
        });
    },

    createOptionsIcon: function() {
        return new Ext.menu.Menu({
            hideBorders: true,
            showSeparator : false,
            zIndex :90000,
            items: [{
                        text: 'Imagen 1',
                        iconCls: 'Marker1-icon',
                        id:'iditem1',
                        scope:this,
                        handler:function(){
                            Ext.getCmp('idsplit').setText("Imagen 1");
                            Ext.getCmp('idimage').el.dom.src = this.vecimage [0];
                            this.pointer=0;
                        }
                    },{
                        text: 'Imagen 2',
                        iconCls: 'Marker2-icon',
                        id:'iditem2',
                        scope:this,
                        handler:function(){
                            Ext.getCmp('idsplit').setText("Imagen 2");
                            Ext.getCmp('idimage').el.dom.src = this.vecimage [1];
                            this.pointer=1;
                        }
                    },{
                        text: 'Imagen 3',
                        iconCls: 'Marker3-icon',
                        id:'iditem3',
                        scope:this,
                        handler:function(){
                            Ext.getCmp('idsplit').setText("Imagen 3");
                            Ext.getCmp('idimage').el.dom.src = this.vecimage [2];
                            this.pointer=2;
                        }
                    },{
                        text: 'Imagen 4',
                        iconCls: 'Marker4-icon',
                        id:'iditem4',
                        scope:this,
                        handler:function(){
                            Ext.getCmp('idsplit').setText("Imagen 4");
                            Ext.getCmp('idimage').el.dom.src = this.vecimage [3];
                            this.pointer=3;
                        }
                    },{
                        text: 'Imagen 5',
                        iconCls: 'Marker5-icon',
                        id:'iditem5',
                        scope:this,
                        handler:function(){
                            Ext.getCmp('idsplit').setText("Imagen 5");
                            Ext.getCmp('idimage').el.dom.src = this.vecimage [4];
                            this.pointer=4;
                        }
                    },{
                        text: 'Imagen 6',
                        id:'iditem6',
                        iconCls: 'Marker6-icon',
                        scope:this,
                        handler:function(){
                            Ext.getCmp('idsplit').setText("Imagen 6");
                            Ext.getCmp('idimage').el.dom.src = this.vecimage [5];
                            this.pointer=5;
                        }
                    }]
          });
    },

    createSplitButton: function() {
        return new Ext.SplitButton({
            text: "Imagen 1",
            id:'idsplit',
            style : "display: block; padding-right: 25px;",
            menu: optionsicon
        })
    },

    createPanelIcon: function() {
        return new Ext.Panel({
            autoWidth : true,
            autoHeight:true,
            bodyStyle:'padding:2px 0px 5px 61px',
            layout: {
                type: 'table',
                columns: 4
            },
            items:[ {
                        xtype: 'label',
                        html: "<b>"+OpenLayers.i18n("icon")+" :</b>",
                        style : "display: block; padding-right: 25px;"
                    },
                    splitButton,
                    componentImage,]
        });
    },

    createComboBox: function() {
        return new Ext.form.ComboBox({
            x:30,
            width : 252,
            editable: false,
            queryMode : 'local',
            emptyText : OpenLayers.i18n("comboWatermark"),
            autoWidth : true,
            autoHeigth : true,
            autoSelect: true,
            typeAhead: true,
            triggerAction: 'all',
            lazyRender:true,
            mode: 'local',
            valueField: 'idf',
            displayField: 'optionf',
            store: new Ext.data.ArrayStore({
                id: 0,
                fields : ['idf', 'optionf'],
                data : [[0, OpenLayers.i18n("comboDD")], [1, OpenLayers.i18n("comboDMS")], [2, OpenLayers.i18n("comboUTM")]]
            }),
            listeners : {
                scope : this,
                select : function(cb) {
                    switch(cb.getValue()) {
                        case 0:
                            Ext.getCmp('fieldy').reset();
                            Ext.getCmp('fieldx').reset();
                            paneldd.setVisible(true);
                            paneldms.setVisible(false);
                            panelutm.setVisible(false);
                            break;
                        case 1:
                            Ext.getCmp('field1').reset();
                            Ext.getCmp('field2').reset();
                            Ext.getCmp('field3').reset();
                            Ext.getCmp('field4').reset();
                            Ext.getCmp('field5').reset();
                            Ext.getCmp('field6').reset();
                            paneldms.setVisible(true);
                            paneldd.setVisible(false);
                            panelutm.setVisible(false);
                            break;
                        case 2:
                            Ext.getCmp('field13').reset();
                            Ext.getCmp('field23').reset();
                            panelutm.setVisible(true);
                            comboutm.setValue(19);
                            area=19;
                            paneldd.setVisible(false);
                            paneldms.setVisible(false);
                            break;
                    }
                }
            }
        });
    },

    createPanelDD: function() {
        return  new Ext.Panel({
            title: OpenLayers.i18n("titleDD"),
            frame: true,
            hidden:false,
            id:'idpanel1',
            name:'idpanel1',
            style : "display: block; padding-top: 10px;",
            bodyStyle:'padding:10px 5px 10px 30px',
            layout: {
                type: 'table',
                columns: 2
            },
            border : true,
            width : 316,
            items : [{
                        xtype: 'label',
                        html: OpenLayers.i18n("latitude")+" : ",
                        style : "display:block; padding-right: 24px;"
                    },{
                        xtype : 'numberfield',
                        decimalPrecision : 5,
                        name : 'fieldy',
                        id : 'fieldy',
                        emptyText :"-16.49758          ",
                        width : 130,
                        maxValue: this.values.bboxMaxLat,
                        minValue: this.values.bboxMinLat,
                        allowBlank : true
                    },{
                        xtype: 'label',
                        html: '&nbsp;',
                        colspan:2
                    },{
                        xtype: 'label',
                        html: OpenLayers.i18n("longitude")+" : ",
                        style : "display:block; padding-right: 24px;"
                    },{
                        xtype : 'numberfield',
                        decimalPrecision : 5,
                        name : 'fieldx',
                        id : 'fieldx',
                        width : 130,
                        emptyText :"-68.13405          ",
                        maxValue: this.values.bboxMaxLong,
                        minValue: this.values.bboxMinLong,
                        allowBlank : true
                    }],
            buttons : [{
                    scope : this,
                    text : OpenLayers.i18n("locate"),
                    handler : function() {
                        //Gets entries from different text fields
                        var namepoint = Ext.getCmp('idnamepoint').getValue();
                        var value_y = Math.round((Ext.getCmp('fieldy').getValue()) * 100000) / 100000;
                        var value_x = Math.round((Ext.getCmp('fieldx').getValue()) * 100000) / 100000;

                        if(this.validateLongText(namepoint)){
                            if(this.validateWhiteSpace(value_x) ||
                                this.validateWhiteSpace(value_y) ||
                                this.validateWhiteSpace(namepoint) ){
                                    this.showMessageWhiteSpaces();
                            }else{
                                    this.validateLimits(value_x,value_y,namepoint);
                            }
                        }
                    }
                }]
        });
    },

    createPanelDMS: function() {
        return  new Ext.Panel({
            title:OpenLayers.i18n("titleDMS"),
            frame: true,
            hidden:false,
            id:'idpanel2',
            name:'idpanel2',
            border : true,
            width : 316,
            style : "display: block; padding-top: 10px;",
            bodyStyle:'padding:10px 10px 5px 7px',
            layout: {
                type: 'table',
                columns: 7
            },
            items : [{
                        xtype: 'label',
                        html: OpenLayers.i18n("latitude")+" : ",
                        style : "display: block; padding-right: 12px;"
                    },{
                        xtype : 'numberfield',
                        decimalPrecision : 5,
                        name : 'field1',
                        id : 'field1',
                        width : 50,
                        emptyText :"16          ",
                        maxValue: this.values.bboxMaxLatDMS,
                        minValue: this.values.bboxMinLatDMS,
                        allowBlank : true
                    },{
                        xtype: 'label',
                        html:"&nbsp;&nbsp;º&nbsp;&nbsp;"
                    },{
                        xtype : 'numberfield',
                        decimalPrecision : 5,
                        name : 'field2',
                        id : 'field2',
                        width : 50,
                        emptyText :"29          ",
                        maxValue: this.values.maxValueMS,
                        minValue: this.values.minValueMS,
                        allowBlank : true
                    },{
                        xtype: 'label',
                        html: "&nbsp;&nbsp;'&nbsp;&nbsp;"
                    },{
                        xtype : 'numberfield',
                        decimalPrecision : 5,
                        name : 'field3',
                        id : 'field3',
                        width :50,
                        emptyText :"51.3          ",
                        maxValue: this.values.maxValueMS,
                        minValue: this.values.minValueMS,
                        allowBlank : true
                    },{
                        xtype: 'label',
                        html: "&nbsp;&nbsp;''&nbsp;&nbsp;&nbsp;&nbsp;"+"S"
                    },{
                        xtype: 'label',
                        html: "&nbsp;",
                        colspan:7
                    },{
                        xtype: 'label',
                        html: OpenLayers.i18n("longitude")+" : ",
                        style : "display: block; padding-right: 12px;"
                    },{
                        xtype : 'numberfield',
                        decimalPrecision : 5,
                        name : 'field4',
                        id : 'field4',
                        width : 50,
                        emptyText :"68          ",
                        maxValue: this.values.bboxMaxLongDMS,
                        minValue: this.values.bboxMinLongDMS,
                        allowBlank : true
                    },{
                        xtype: 'label',
                        html:"&nbsp;&nbsp;º&nbsp;&nbsp;"
                    },{
                        xtype : 'numberfield',
                        decimalPrecision : 5,
                        name : 'field5',
                        id : 'field5',
                        width : 50,
                        emptyText :"8          ",
                        maxValue: this.values.maxValueMS,
                        minValue: this.values.minValueMS,
                        allowBlank : true
                    },{
                        xtype: 'label',
                        html: "&nbsp;&nbsp;'&nbsp;&nbsp;"
                    },{
                        xtype : 'numberfield',
                        decimalPrecision : 5,
                        name : 'field6',
                        id : 'field6',
                        width : 50,
                        emptyText :"2.57          ",
                        maxValue: this.values.maxValueMS,
                        minValue: this.values.minValueMS,
                        allowBlank : true
                    },{
                        xtype: 'label',
                        html: "&nbsp;&nbsp;''&nbsp;&nbsp;&nbsp;&nbsp;"+"w"
                    }],
            buttons : [{
                    scope: this,
                    text : OpenLayers.i18n("locate"),
                    handler : function() {
                        //Gets entries from different text fields
                        var namepoint=Ext.getCmp('idnamepoint').getValue();
                        var latg = Ext.getCmp('field1').getValue();
                        var latm = Ext.getCmp('field2').getValue();
                        var lats = Ext.getCmp('field3').getValue();
                        var longig = Ext.getCmp('field4').getValue();
                        var longim= Ext.getCmp('field5').getValue();
                        var longis= Ext.getCmp('field6').getValue();

                        var lat=this.getDmsToDd(latg,latm,lats);
                        var longi=this.getDmsToDd(longig,longim,longis);

                        //Valida titulo que se a de 20 caracteres
                        if(this.validateLongText(namepoint)){
                            if( (latg>=this.values.bboxMinLatDMS && latg<=this.values.bboxMaxLatDMS) && 
                                this.validateMS(latm)&&this.validateMS(lats) &&
                                (longig>=this.values.bboxMinLongDMS && longig<=this.values.bboxMaxLongDMS) &&
                                this.validateMS(longim)&&this.validateMS(longis)&& !this.validateWhiteSpace(namepoint)){
                                        this.validateLimits(longi*(-1),lat*(-1),namepoint);
                            }else{
                                if(this.validateWhiteSpace(latg) || this.validateWhiteSpace(latm)  ||
                                    this.validateWhiteSpace(lats) || this.validateWhiteSpace(longig)||
                                    this.validateWhiteSpace(longim) || this.validateWhiteSpace(longis)||
                                    this.validateWhiteSpace(namepoint)){
                                        this.showMessageWhiteSpaces();
                                }else{
                                    //Error Message invalid values ​​for DMS
                                    Ext.MessageBox.show({
                                        title: OpenLayers.i18n("error"),
                                        width: 190,
                                        y: 50,
                                        id:'idmensage',
                                        name: 'idmensage',
                                        msg: OpenLayers.i18n("invalidValues"),
                                        buttons: Ext.MessageBox.OK,
                                        icon: Ext.MessageBox.ERROR
                                    })
                                }
                            }
                        }
                    }
                }]
        });
    },

    //In Utm coordinates only take into account the zones 19, 20, 21 
    //corresponding to Bolivia, the options are in the combobox
    createPanelUTM: function() {
        return  new Ext.Panel({
            title:OpenLayers.i18n("titleUTM"),
            frame: true,
            hidden:false,
            id:'idpanel3',
            name:'idpanel3',
            border : true,
            width : 316,
            style : "display: block; padding-top: 10px;",
            bodyStyle:'padding:10px 0px 5px 15px',
            layout: {
                type: 'table',
                columns: 5
            },
            items : [{
                        xtype: 'label',
                        html: "X : ",
                        style : "display: block; padding-right: 8px;"
                    },{
                        xtype : 'numberfield',
                        decimalPrecision : 5,
                        name : 'field13',
                        id: 'field13',
                        maxValue: 10000000000,
                        minValue: 0,
                        width : 100,
                        emptyText :"592419.98          "
                    },{
                        xtype: 'label',
                        html: "&nbsp;[m]&nbsp;&nbsp;S"
                    },{
                        xtype: 'label',
                        html: OpenLayers.i18n("area"),
                        style : "display: block; padding-left: 24px;padding-right:12px;",
                        rowspan: 3
                    },
                        comboutm,
                      {
                        xtype: 'label',
                        html: "&nbsp;",
                        colspan:5
                    },{
                        xtype: 'label',
                        html: "Y : ",
                        style : "display: block; padding-right: 8px;"
                    },{
                        xtype : 'numberfield',
                        decimalPrecision : 5,
                        name : 'field23',
                        id: 'field23',
                        maxValue: 10000000000,
                        minValue: 0,
                        width :100,
                        emptyText :"8175825.14          "
                    },{
                        xtype: 'label',
                        html: "&nbsp;[m]&nbsp;&nbsp;W"
                    }],
            buttons : [{
                    text : OpenLayers.i18n("locate"),
                    scope: this,
                    handler : function() {
                        var namepoint=Ext.getCmp('idnamepoint').getValue();
                        var value_x= Ext.getCmp('field13').getValue();
                        var value_y = Ext.getCmp('field23').getValue();
                        if(this.validateLongText(namepoint)){
                            if(this.validateWhiteSpace(value_x) || 
                                this.validateWhiteSpace(value_y) ||
                                this.validateWhiteSpace(namepoint) ){
                                    this.showMessageWhiteSpaces();
                            }else{
                                utm(this,value_x,value_y,this.area,namepoint);
                            }
                        }
                    }
                }]
        });
    },

    createComboUtm: function() {
        return new Ext.form.ComboBox({
            rowspan: 3,
            width : 40,
            editable: false,
            queryMode : 'local',
            emptyText : '',
            typeAhead: true,
            triggerAction: 'all',
            lazyRender:true,
            mode: 'local',
            valueField: 'id3',
            displayField: 'option3',
            store: new Ext.data.ArrayStore({
                id: 0,
                fields : ['id3', 'option3'],
                data : [[0, '19'], [1, '20'], [2, '21']]
            }),
            listeners : {
                scope : this,
                select : function(cb) {
                    switch(cb.getValue()) {
                        case 0:
                            this.area=19;
                            break;
                        case 1:
                            this.area=20;
                            break;
                        case 2:
                            this.area=21;
                            break;
                    }
                }
            }

        });
    },

    createComponentImage: function() {
        return new Ext.BoxComponent({
            autoEl: {
                tag: 'img',
                src: this.vecimage[0],
                id: 'idautoel'
            },
            region: 'right',
            id:'idimage',
            name: 'idimage',
            hidden:false,
            width: 40,
            height : 40
        });
    },

    addCoordinate : function(x, y,text) {
        x=Math.round(x * 100000) / 100000;
        y=Math.round(y * 100000) / 100000;
        var LonLat = new OpenLayers.LonLat(x, y).transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection(mapi.getProjection()))
        mapi.setCenter(LonLat,mapi.getZoom);

        var iconMarker = new OpenLayers.Icon(this.vecimage[this.pointer],tamanio,offset);

        var marker = new OpenLayers.Marker(LonLat, iconMarker);
                
        marker.PlanID = text;      

        var popup = new GeoExt.Popup({
            id: text,
            name: text,
            location: LonLat,
            map: mapi,
            draggable: false,
            closable: true,

            closeAction: 'hide',
            unpinnable:false,
            layout:'auto',
            maximizable: false,
            popupCls: "gx-popup-point",
            width:160,
            height : 150,
            hideBorders : true,
            resizable: false,
            bodyStyle:'background-color:#FFFFFF;padding:3px 0px 0px 3px',
            html: "<div style='font-size:11px;'><b>&nbsp;"+text+"</b><br>"+ "&nbsp;Latitud&nbsp;&nbsp;&nbsp;&nbsp;: " +y+"<br>&nbsp;Longitud &nbsp;: " + x+"</div>",
            bbar: [
                '->',{
                        iconCls:'delete-icon',
                        text:'Eliminar',
                        scope: this,
                        handler : function() {
                            this.destroyMarker(text)
                        }
                    }]
        });
        popup.setVisible(false);
        arrPopups.push(popup)
        
        // Event that performs the action of displaying the Popup for your marker
        // happens when you click on the Marker.
        marker.events.register('click', marker, function() {
            for (var x in arrPopups) {
                if (arrPopups[x].getId() == marker.PlanID){
                        arrPopups[x].setVisible(true);
                        return;
                }
            }
        });
        
        var mapDiv = document.getElementById("OpenLayers.Map_13_events"); 
        
        marker.events.register("mouseover", marker, function() {
            mapDiv.style.cursor = "pointer";
        });
	marker.events.register("mouseout", marker, function() {
            mapDiv.style.cursor = "default";
        });

        
        arrMarkers.push(marker);
        arrTitles.push(text);
        
        this.layer.addMarker(marker);
    },

    destroyMarker : function (planID) {
        for (var x in arrMarkers) {
            if (arrMarkers[x].PlanID == planID) {
                this.layer.removeMarker(arrMarkers[x]);
                arrPopups[x].destroy();
                arrTitles.splice(x, 1);
                arrPopups.splice(x, 1);
                arrMarkers.splice(x, 1);
                return;
            }
        }
    },
    
    validateTitle : function (title) {
        for (var x in arrTitles) {
            if (arrTitles[x] == title){ 
                return false;
            }
        }
        return true;
    },
    
    validateLimits : function (value_x,value_y,text){
        if ((value_x >= this.values.bboxMinLong) && 
            (value_x <= this.values.bboxMaxLong) && 
            (value_y >= this.values.bboxMinLat) && 
            (value_y <= this.values.bboxMaxLat )) {
                if (this.validateTitle(text)){ 
                        this.addCoordinate(value_x,value_y,text);
                } else{ 
                        //Error message indicating that enter another title for the coordinate
                        Ext.MessageBox.show({
                            title: OpenLayers.i18n("existingTitle"),
                            width: 190,
                            y: 50,
                            msg: OpenLayers.i18n("otherName"),
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.ERROR
                        })
                }
        }else {
                // Error Message indicating that the coordinate entered this
                // out of range of Bolivia
                Ext.MessageBox.show({
                    title: OpenLayers.i18n("outOfRange"),
                    width: 225,
                    y: 50,
                    msg: OpenLayers.i18n("invalidCoord"),
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.ERROR
               })
        }
    },

    showMessageWhiteSpaces : function (){
        Ext.MessageBox.show({
            title: OpenLayers.i18n("error"),
            width: 180,
            y: 50,
            id:'idmensage',
            name: 'idmensage',
            msg: OpenLayers.i18n("fillFields"),
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.ERROR
        })
    },
    
    validateLongText : function (text){
        if(text.length>20){
            Ext.MessageBox.show({
                title: OpenLayers.i18n("error"),
                width: 280,
                y: 50,
                msg: OpenLayers.i18n("maxCharacters"),
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.ERROR
            });
            return false;
        }
        return true;
    },

    getDmsToDd :function (g,m,s){
        var res=0;
        res=g+(m/60) +(s/3600);
        return res;
    },

    validateMS : function (l){
        if(l>=0 && l<=59 && l!=null)
            return true;
        else
            return false;
    },

    validateWhiteSpace : function (ll){
        if(ll=="")
            return true;
        else
            return false;
    },
    
    destroy: function() {
        //this.layer.destroy();
        this.win.destroy();
        this.map = null;
    }
};
