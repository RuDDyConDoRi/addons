/*
* Copyright (c) 2013 by GeoBolivia
* Author: Ruddy Condori Topoco <rucocool@gmail.com, rucocool@hotmail.com, rucondori@geo.gob.bo>
*/

Ext.namespace("GEOR.Addons");

GEOR.Addons.ExportCSVtoKML = function(map, options) {
    this.map = map;
    this.options = options;
    this.layer = null;
};

GEOR.Addons.ExportCSVtoKML.prototype = {
    
    item: null,
    stores: {},
    layer: null,
    jsonFormat: null,
    geojsonFormat: null,
    
    //panelData: null,
    panelLayers: null,
    
    listLayers: null,                                        
    layerarray: null,                                         
    //listDesc:null,                                                
    myForm: null,                                        
              
    ctrlSelect:null,                                        
    //layerCSV: null,                                        
    mmap: null,                                                
    //nameLayer:"",
    //icon: null,
/**
* Method: init
*
* Parameters:
* record - {Ext.data.record} a record with the addon parameters
*/
    init: function(record) {
        var lang = OpenLayers.Lang.getCode();
        this.jsonFormat = new OpenLayers.Format.JSON();
        this.geojsonFormat = new OpenLayers.Format.GeoJSON();
        mmap = this.map;
        
        this.item = new Ext.menu.Item({
            text: record.get("title")[lang],
            iconCls: 'exportcsvtokml-icon',
            qtip: record.get("description")[lang],
            handler: this.showWindow,
            scope: this
        });
        layerarray = new Ext.data.ArrayStore({
	    fields: ['number','layer'],
	    data : [[0," "]]
	});
	GEOR.Addons.ExportCSVtoKML.prototype.update();        
        listLayers = this.createList();
        panelLayers = this.createPanelLayers();
       
        myForm = this.createForm();
        return this.item;
    },
    
    showWindow: function() {
        if (!this.win) {
            this.win = new Ext.Window({
                autoHeight : true,
                constrain: true,
                iconCls: 'exportcsvtokml-icon',
                closable: true,
                closeAction: 'hide',
                collapsible: true,
                layout:'column',
                resizable: false,
                width:344,
                height: 383,
                title: OpenLayers.i18n("tittle"),
                border: false,
                buttonAlign: 'left',
                items : [myForm],
                fbar: [{
			iconCls:'help-icon',
			iconAlign: 'left',
			scale:'medium',
			scope: this,
			handler : function() {
		           window.open(this.options.urlHelp);
			}
		    },{
			iconCls:'refresh-icon',
			iconAlign: 'left',
			text:OpenLayers.i18n("  Refresh"),
			textAlign: 'right',
			scope: this,
			handler : function() {
			    GEOR.Addons.ExportCSVtoKML.prototype.update();
			}
		    },'->',{
		    text: OpenLayers.i18n('Export KML'),
		    border: false,
		    handler: function(){
			GEOR.Addons.ExportCSVtoKML.prototype.exportLayersCSV();
			this.win.hide();
		    },
		    scope: this
		}
                ],
                listeners: {
                 "hide": function() {
		    //GEOR.Addons.ExportCSVtoKML.prototype.enablePanel(true);
		    //GEOR.Addons.ExportCSVtoKML.prototype.resetValues();
                 }, scope: this
                }
            });
        }
        this.win.show();
    },
    
    createForm: function() {
        return new Ext.FormPanel({
         labelWidth: 100,
	 labelAlign: 'right',
	 width: '100%',
         height: '100%',
	 frame: true,
	 bodyStyle: 'padding:5px 5px 0',
	 items: [{
		xtype:'label',
		text: OpenLayers.i18n('Choose a layer to export to KML format'),
		style: 'font-size: 9pt;',
		anchor:'100%'
	    }, {
		layout: 'column',
		items: [{
			  columnWidth: 1.0,
			  layout: 'form',
			  items: [panelLayers]
			}
		    ],
		    listeners: {
		    }
                }
         ]
        });
    },
      
    update: function(){                                         
        
        var layer = null;
        var layersVisible = mmap.layers;
	
	var newData = [];
	
        for(var i=layersVisible.length-1 ; i>= 0 ; i--){
	    layer = mmap.layers[i];
            if (layer.valueCSV == "csv") {
		newData.push([i, layer.name]);
            }
        }
	layerarray.loadData(newData,false);
	layerarray.data.reload;
    },
    
    createList: function(){
        var listLayers = {
         xtype: 'multiselect',
         fieldLabel: OpenLayers.i18n('CSV file layers'),
         name: 'multiselec',
         displayField: 'layer',
         valueField: 'number',
         width: 160,
         height: 100,
         triggerAction: 'all',
         allowBlank:false,
         store: layerarray,
         ddReorder: true,
        };
        return listLayers;
    },
           
    createPanelLayers:function(){
        var panel = new Ext.Panel({
         width: 350,
         layout: 'column',
         border: false,
         items: [{
                  columnWidth: 1.0,
                  layout: 'form',
                  items: [listLayers]
                }
         ]
        });
        return panel;
    },
        
    destroy: function() {
        this.layer = null;
        this.mmap = null;
        this.win.destroy();
    },
    
    exportAsKml: function(layer_insert) {
	if(layer_insert.features.length>0){
	    var urlObj = OpenLayers.Util.createUrlObject(window.location.href),
	    format = new OpenLayers.Format.KML({
		'foldersName': urlObj.host,
		'internalProjection': mmap.getProjectionObject(),
		'externalProjection': new OpenLayers.Projection("EPSG:4326")
	    });
	    OpenLayers.Request.POST({
		url: "ws/kml/",
		data: format.write(layer_insert.features),
		success: function(response) {
		    var o = Ext.decode(response.responseText);
		    window.location.href = o.filepath;
		}
	    });
	}
    },
    
    exportLayersCSV: function(){
        var dats= myForm.getForm().getValues(true).replace(/&/g,', ');
	var da= dats.split(",");
	var desc = da[0].split("=");
        
        if (desc[1] != '') {
	    var layer = null;
	    var layersVisible = mmap.layers;   
	    for(var i=layersVisible.length-1 ; i>= 0 ; i--){
		GEOR.waiter.show();
		layer = mmap.layers[i];
		if (layer.valueCSV == "csv") {
		    if (i == desc[1]) {
			GEOR.Addons.ExportCSVtoKML.prototype.exportAsKml(layer);
		    }
		}
	    }
        }
    },
};
