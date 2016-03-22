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
                {id: "title",    sort:"string", header:[{text: "Title"},  {content:"textFilter"}], fillspace:true},
                {id: "year",     sort:"string", header:[{text: "Year"},   {content:"textFilter"}]},
                {id: "category", sort:"string", header:[{text: "Category"},  {content:"textFilter"}], editor:"select", options:["Good","Bad", "Ugly"]},
                {id: "sub-cat",  sort:"int",    header:[{text: "Sub Category"},   {content:"textFilter"}]},    
                {id: "rating",   sort:"number", header:[{text: "Rating"}, {content:"textFilter"}]},
                {id: "rank",     sort:"int",    header:[{text: "Rank"},   {content:"textFilter"}]},  
                {id: "price",    sort:"int",    header:[{text: "Price"},  {content:"textFilter"}], format:webix.i18n.priceFormat, css: "price"}
                    
            ],
            select: "row",
            navigation:true,
            url: "/sample/data.json"
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
