    Ext.namespace("GEOR.Addons");

GEOR.Addons.Convertion_Coordinates = function(map, options) {
    this.options = options;
    this.map=map;
};

GEOR.Addons.Convertion_Coordinates.prototype = {
    formBasic: null,
    comboPanels: null,
    panel1 :null,
    panel2 :null,
    panelAnswer : null,
    panelError : null,
    comboutm: null,
    buttonClean : null,
    buttonConvertion : null,
    comboLat : null,
    comboLong : null,

    space:  "&nbsp;",
    space2: "&nbsp;&nbsp;",
    space3: "&nbsp;&nbsp;&nbsp;",
    space6: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;",

    pointer: 0,
    
    valLat: 'S',
    valLong: 'W',

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
            iconCls: 'convertion_coordinates-icon',
            qtip: record.get("description")[lang],
            handler:this.showWindow,
            scope: this
        });
        panel1 = this.createpanel1().setVisible(false);
        comboLat = this.createComboLat().setValue('S');
        comboLong = this.createComboLong().setValue('W');
        panel2 = this.createpanel2().setVisible(false);
        panelError = this.createPanel_error().setVisible(false);
        comboPanels = this.createComboPanels();
        panelAnswer = this.createPanelAnswer();
       

        formBasic = this.createformBasic();
        return this.item;
    },
    
    showWindow: function() {
        if (!this.win) {
            this.win = new Ext.Window({
                title : OpenLayers.i18n("title"),
                width : 310,
                autoHeight : true,
                constrain: true,
                resizable : false,
                x:970,
                y:33,
                id:'win',
                name:'win',
                collapsible: true,
                items : [formBasic],
                iconCls: 'convertion_coordinates-icon',
                closable: true,
                closeAction: 'hide',
                buttonAlign: 'left',
                fbar: ['->',
                {
                    xtype: 'label',
                    html: "<pre><b>Datum: WGS 84</b></pre>"
                }
                ]
            })
        }
        this.win.show();
    },

    createformBasic: function() {
        return new Ext.FormPanel({
            autoHeigth : true,
            autoWidth : true,
            frame : true,
            border: true,
            buttonAlign: 'center',
            layout: {
                type: 'table',
                columns: 2
            },
            items :
            [
            {
                xtype: 'label',
                html: this.space6+this.space+this.space6+"<b>"+OpenLayers.i18n("convertion")+"</b>",
                colspan: 2
            },
            {
                xtype: 'label',
                html: this.space,
                colspan: 2
            },
            
            {
                xtype: 'label',
                html: "<b>"+this.space6+this.space3+"DE : "+this.space6+"</b>"
            },
            comboPanels,
            {
                xtype: 'label',
                html: this.space,
                colspan: 2
            },
            panel1,panel2,
            {
                xtype: 'label',
                html: this.space,
                colspan: 2
            },
            {
                xtype: 'label',
                html: "<b>"+this.space6+"A : "+this.space6+"</b>"
            },
            {
                    xtype: 'label',
                    id:'idAtext',
                    name:'idAtext'
            },
            panelAnswer,
            panelError
            ],
            buttons : [this.createButtonClean(),{
                xtype: 'label',
                html: this.space6+this.space6
            },this.createButtonConvertion()]
        });
    },
    
    createComboPanels: function() {
        return new Ext.form.ComboBox({
            width : 170,
            editable: false,
            queryMode : 'local',
            emptyText : 'Desplace el selector',
            typeAhead: true,
            triggerAction: 'all',
            lazyRender:true,
            mode: 'local',
            valueField: 'idComboPanels',
            displayField: 'optionComboPanels',
            store: new Ext.data.ArrayStore({
                id: 0,
                fields : ['idComboPanels', 'optionComboPanels'],
                data : [[0, 'Grados Decimales'], [1, 'Grados Minutos Segundos']]
            }),
            listeners : {
                scope : this,
                select : function(cb) {
                    this.changeComboPanels(cb.getValue());
                }
            }

        });
    },
    
    changeComboPanels : function(nropcion) {
        switch(nropcion) {
            case 0:
                panel1.setVisible(true);
                Ext.getCmp('idAtext').setText('Grados Minutos Segundos');
                panel2.setVisible(false);
                break;
            case 1:
                panel2.setVisible(true);
                Ext.getCmp('idAtext').setText('Grados Decimales');
                panel1.setVisible(false);
                break;
        }
    },
    
    createComboLat: function() {
        return new Ext.form.ComboBox({
            width : 35,
            editable: false,
            queryMode : 'local',
            emptyText : '',
            typeAhead: true,
            triggerAction: 'all',
            lazyRender:true,
            mode: 'local',
            valueField: 'idComboLat',
            displayField: 'optionComboLat',
            store: new Ext.data.ArrayStore({
                id: 0,
                fields : ['idComboLat', 'optionComboLat'],
                data : [[0, 'S'], [1, 'N']]
            }),
            listeners : {
                scope : this,
                select : function(cb) {
                    this.changeComboLat(cb.getValue());
                }
            }

        });
    },
    
    changeComboLat : function(nropcion) {
        switch(nropcion) {
            case 0:
                this.valLat='S';
                break;
            case 1:
                this.valLat='N';
                break;
        }
    },
    
    createComboLong: function() {
        return new Ext.form.ComboBox({
            width : 35,
            editable: false,
            queryMode : 'local',
            emptyText : '',
            typeAhead: true,
            triggerAction: 'all',
            lazyRender:true,
            mode: 'local',
            valueField: 'idComboLong',
            displayField: 'optionComboLong',
            store: new Ext.data.ArrayStore({
                id: 0,
                fields : ['idComboLong', 'optionComboLong'],
                data : [[0, 'W'], [1, 'E']]
            }),
            listeners : {
                scope : this,
                select : function(cb) {
                    this.changeComboLong(cb.getValue());
                }
            }

        });
    },
    
    changeComboLong : function(nropcion) {
        switch(nropcion) {
            case 0:
                this.valLat='W';
                break;
            case 1:
                this.valLat='E';
                break;
        }
    },

    createpanel1: function() {
        return  new Ext.Panel({
            colspan: 2,
            title: OpenLayers.i18n("titform1"),
            frame: true,
            hidden:false,
            id:'idpanel1',
            name:'idpanel1',
            width : 286,
            bodyStyle:'padding:10px 5px 10px 30px',
            layout: {
                type: 'table',
                columns: 2
            },
            border : true,
            items : [
            {
                xtype: 'label',
                html: OpenLayers.i18n("txtlat")+" : "+this.space3+this.space3
            },
            {
                xtype : 'numberfield',
                decimalPrecision : 5,
                name : 'fieldy',
                id : 'fieldy',
                emptyText :"-16.49758          ",
                width : 130,
                //maxValue: this.values.max_form1_1,
                //minValue: this.values.min_form1_1,
                allowBlank : true
            },
            {
                xtype: 'label',
                html: this.space2,
                colspan:2
            },
            {
                xtype: 'label',
                html: OpenLayers.i18n("txtlong")+" : "+this.space3+this.space3
            },
            {
                xtype : 'numberfield',
                decimalPrecision : 5,
                name : 'fieldx',
                id : 'fieldx',
                width : 130,
                emptyText :"-68.13405          ",
                //maxValue: this.values.max_form1_2,
                //minValue: this.values.min_form1_2,
                allowBlank : true
            }
            ]
        });
    },

    createpanel2: function() {
        return  new Ext.Panel({
            title:OpenLayers.i18n("titform2"),
            colspan: 2,
            frame: true,
            hidden:false,
            id:'idpanel2',
            name:'idpanel2',
            border : true,
            width : 286,
            bodyStyle:'padding:10px 5px 10px 5px',
            layout: {
                type: 'table',
                columns: 8
            },

            items : [
            {
                xtype: 'label',
                html: OpenLayers.i18n("txtlat")+" : "+this.space2
            },
            {
                xtype : 'numberfield',
                decimalPrecision : 5,
                name : 'field1',
                id : 'field1',
                width : 40,
                emptyText :"16          ",
                //maxValue: this.values.max_form2_1,
                //minValue: this.values.min_form2_1,
                allowBlank : true
            },
            {
                xtype: 'label',
                html:"<b>"+this.space+"º"+this.space+"</b>"
            },
            {
                xtype : 'numberfield',
                decimalPrecision : 5,
                name : 'field2',
                id : 'field2',
                width : 40,
                emptyText :"29          ",
                maxValue: 59.99999,
                minValue: 0,
                allowBlank : true
            },
            {
                xtype: 'label',
                html: "<b>"+this.space+"'"+this.space+"</b>"
            },
            {
                xtype : 'numberfield',
                decimalPrecision : 5,
                name : 'field3',
                id : 'field3',
                width :40,
                emptyText :"51.3          ",
                maxValue: 59.99999,
                minValue: 0,
                allowBlank : true
            },
            {
                xtype: 'label',
                html: "<b>"+this.space+"''"+this.space2+this.space2+"</b>"
            },
            comboLat,
            {
                xtype: 'label',
                html: this.space,
                colspan:8
            },
            {
                xtype: 'label',
                html: OpenLayers.i18n("txtlong")+" : "+this.space2
            },
            {
                xtype : 'numberfield',
                decimalPrecision : 5,
                name : 'field4',
                id : 'field4',
                width : 40,
                emptyText :"68          ",
                //maxValue: this.values.max_form2_2,
                //minValue: this.values.min_form2_2,
                allowBlank : true
            },
            {
                xtype: 'label',
                html:"<b>"+this.space+"º"+this.space+"</b>"
            },
            {
                xtype : 'numberfield',
                decimalPrecision : 5,
                name : 'field5',
                id : 'field5',
                width : 40,
                emptyText :"8          ",
                maxValue: 59.99999,
                minValue: 0,
                allowBlank : true
            },
            {
                xtype: 'label',
                html: "<b>"+this.space+"'"+this.space+"</b>"
            },
            {
                xtype : 'numberfield',
                decimalPrecision : 5,
                name : 'field6',
                id : 'field6',
                width : 40,
                emptyText :"2.57          ",
                maxValue: 59.99999,
                minValue: 0,
                allowBlank : true
            },
            {
                xtype: 'label',
                html: "<b>"+this.space+"''"+this.space2+this.space2+"</b>"
            },
            comboLong
            ]
        });
    },
    createPanelAnswer: function() {
        return  new Ext.Panel({
            colspan: 2,
            frame: true,
            id:'idPanelAnswer',
            name:'idPanelAnswer',
            border : true,
            autoWidth : true,
            bodyStyle:'padding:5px 5px 5px 10',
            layout: {
                type: 'table',
                columns: 2
            },

            items : [
            {
                xtype: 'label',
                html: "Respuesta",
                colspan: 2
            },
            {
                xtype: 'label',
                html: "Latitud :"
            },
            {
                xtype: 'label',
                id:'idAnswerLat',
                name:'idAnswerLat',
                html: ""
            },
            {
                xtype: 'label',
                html: "Longitud :"
            },
            {
                xtype: 'label',
                id:'idAnswerLong',
                name:'idAnswerLong',
                html: ""
            },
            ]
        });
        
    },
    
    createButtonClean: function() {
        return new Ext.Button({
            text: 'Limpiar',
            scope : this,
            handler : function() {
                
            }  
        });
    },
    
    createButtonConvertion: function() {
        return new Ext.Button({
            text: 'Conversion',
            scope : this,
            arrowAlign : 'bottom',
            handler : function() {
                
            }  
        });
    },

    createPanel_error: function() {
        return new Ext.Panel({
            frame: true,
            //border : true,
            autoWidth : true,
            autoHeigth : true,
            id:'pe',
            name:'pe',
            bodyStyle:'padding:0px 0px 0px 0px',  // v < ^ >
            //            layout: {
            //                type: 'table',
            //                columns: 1
            //            },
            items : [
            new Ext.Toolbar({
                items: [
                {
                    xtype: 'label',
                    html: this.space3+this.space3+
                    this.space3+this.space3+
                    this.space3+this.space3
                },
                {
                    xtype: 'label',
                    id:'errortit',
                    name:'errortit'
                },
                '->',
                {
                    iconCls:'close-icon',
                    scope: this,
                    handler : function() {
                        this.effect3('pe');
                    }
                }
                ]
            }),
            {
                xtype: 'label',
                html: this.space3
            },
            {
                xtype: 'label',
                id:'errormen',
                name:'errormen',
                html: "desenlace"
            }
            ]

        })
    } ,

    change_form : function(nropcion) {
        switch(nropcion) {
            case 0:
                //Ext.get("idpanel1").ghost('t', { duration: 2 });   //se mueve hacia arriba

                //                                Ext.get("idpanel1").ghost('b', {
                //                                    duration: 4,
                //                                    remove: false,
                //                                    useDisplay: false
                //                                });
                //
                panel1.setVisible(true);
                this.effect3('pe');
                this.effect1('idpanel1');
                panel2.setVisible(false);
                panel3.setVisible(false);
                break;
            case 1:
                panel2.setVisible(true);
                this.effect3('pe');
                this.effect1('idpanel2');
                panel1.setVisible(false);
                panel3.setVisible(false);
                break;
            case 2:
                panel3.setVisible(true);
                this.effect3('pe');
                this.effect1('idpanel3');
                panel1.setVisible(false);
                panel2.setVisible(false);
                break;
        }
    },

    outside_rank : function (){
        Ext.getCmp('errortit').setText('<span style="color:red;font-family:sans-serif"><b>'+OpenLayers.i18n("errrangotit")+'</b></span>',false) ;
        Ext.getCmp('errormen').setText('<span style="color:red">'+OpenLayers.i18n("errrangomen")+'</span>',false);
        panelError.setVisible(true);
        Ext.get("pe").frame("B40404", 3, {
            duration: .5
        });
    },

    white_spaces : function (){
        //Ext.get('errormen').highlight("0000ff", { attr: 'color', duration: 5 });
        //Ext.get('errortit').highlight("0000ff", { attr: 'color', duration: 5 });
        Ext.getCmp('errortit').setText('<span style="color:red;font-family:sans-serif"><b>'+OpenLayers.i18n("errblancotit")+'</b></span>',false) ;
        Ext.getCmp('errormen').setText('<span style="color:red">'+OpenLayers.i18n("errblancomen")+'</span>',false);

        panelError.setVisible(true);
        Ext.get("pe").frame("B40404", 3, {
            duration: .5
        });
    //    Ext.MessageBox.show({
    //        title: OpenLayers.i18n("errblancotit"),
    //        width: 230,
    //        y: 50,
    //        msg: OpenLayers.i18n("errblancomen"),
    //        buttons: Ext.MessageBox.OK,
    //        icon: Ext.MessageBox.ERROR
    //    })
    },

    incorrect_data_form2 : function (){
        Ext.getCmp('errortit').setText('<span style="color:red;font-family:sans-serif"><b>'+OpenLayers.i18n("errtitform2")+'</b></span>',false) ;
        Ext.getCmp('errormen').setText('<span style="color:red">'+OpenLayers.i18n("errmenform2")+'</span>',false);
        panelError.setVisible(true);
        Ext.get("pe").frame("B40404", 3, {
            duration: .5
        });
    },

    degrees_minutes_seconds :function (g,m,s){
        var res=0;
        res=g+(m/60) +(s/3600);
        return res;
    },

    validates_form2 : function (l){
        if(l>=0 && l<=59 && l!=null)
            return true;
        else
            return false;
    },

    validates_field : function (ll){
        if(ll=="")
            return true;
        else
            return false;
    },
    
    destroy: function() {
        this.wini.hide();
        this.layer = null;
        this.map = null;
    }
};

