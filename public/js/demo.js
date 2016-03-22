webix.i18n.setLocale("en-UK");

webix.ui({
    rows:[
        {
            view:"template",
            type:"header",
            template:"Oxygen"
        },
        { view:"toolbar", id:"mybar", elements:[
            { view:"button", value:"Add", width: 70},
            { view:"button", value:"Delete", width: 70 },
            { view:"button", value:"Update", width: 70 },
            { view:"button", value:"Clear Form", width: 85 }]
        },  
        {
            view:"datatable",
            autoConfig:true,
            editable:true,
            columns :[
                {id: "name",      sort:"string", header:[{text: "Customer"},  {content:"textFilter"}], width: 250},
                {id: "address",   sort:"string", header:[{text: "Address"},   {content:"textFilter"}], fillspace:true, minWidth: 200},
                {id: "postcode",  sort:"string", header:[{text: "Postcode"},  {content:"textFilter"}], width: 90},
                {id: "telephone", sort:"string", header:[{text: "Telephone"}, {content:"textFilter"}], width: 120},   
                {id: "email",     sort:"string", header:[{text: "Email"},     {content:"textFilter"}], width: 200}
            ],
            select: "row",
            navigation:true,
            url: "/api/customers"
        },
        {view:"resizer"}, //!resizer line
        {
            template:"Row 1"
        },
        {view:"resizer"}, //!resizer line
        { cols:[ //2nd row
            { template : "Column 1" },
            { view : "resizer"}, //!resizer line
            { template : "Column 2" } 
        ]}  
    ]
});
