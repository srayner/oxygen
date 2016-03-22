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
            data:[
                { title:"My Fair Lady",        year:1964, category:533848, rating:9.9,   rank:5,  price:   9.00 },
                { title:"A N Other",           year:1974, category:533848, rating:8.4,   rank:4,  price:  20.99 },
                { title:"Somewhere, sometime", year:1982, category:533848, rating:103.9, rank:3,  price:  10.28 },
                { title:"Ouch",                year:1947, category:533848, rating:2.2,   rank:2,  price:  30.36 },
                { title:"Really cool",         year:1932, category:533848, rating:5.4,   rank:10, price: 200.22 },
                { title:"My Fair Man",         year:1916, category:533848, rating:7.8,   rank:6,  price:  10.09 }
            ]      
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
