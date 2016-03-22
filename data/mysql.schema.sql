-- Suppliers
create table supplier (
    id        Integer(11)  NOT NULL AUTO_INCREMENT,
    name      NVarChar(64) NOT NULL, 
    address   text         NOT NULL,
    postcode  NVarChar(8)  NOT NULL,
    telephone NVarChar(24),
    email     NVarChar(128),
    PRIMARY KEY (
        id
    )
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;

-- Customer
create table supplier (
    id        Integer(11)  NOT NULL AUTO_INCREMENT,
    name      NVarChar(64) NOT NULL, 
    address   text         NOT NULL,
    postcode  NVarChar(8)  NOT NULL,
    telephone NVarChar(24),
    email     NVarChar(128),
    PRIMARY KEY (
        id
    )
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;

-- Product(/service)
create table product (
    id            Integer(11)    NOT NULL AUTO_INCREMENT,
    category      NVarChar(64)   NOT NULL, 
    code          NVarchar(64)   NOT NULL,
    description   NVarChar(128)  NOT NULL,
    supplier_id   integer        NOT NULL,
    supplier_code NVarChar(64),
    price_list    numeric(10,2)  NOT NULL,
    discount      numeric(4,2)   NOT NULL,
    group         NVarchar(64),
    PRIMARY KEY (
        id
    )
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;

-- Quote
create table quote (
    id              Integer(11)   NOT NULL AUTO_INCREMENT,
    ref             NVarChar(32)  NOT NULL, 
    description     NVarChar(128) NOT NULL,
    customer_id     integer       NOT NULL,
    quote_status_id integer       NOT NULL,
    PRIMARY KEY (
        id
    )
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;

-- Quote status
create table quote_status (
    id              Integer(11)   NOT NULL AUTO_INCREMENT,
    name            NVarChar(32)  NOT NULL, 
    description     NVarChar(128) NOT NULL,
    PRIMARY KEY (
        id
    )
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;

-- Quote lines
create table quote_product (
    quote_id        Integer(11)   NOT NULL,
    product_id      Integer(11)   NOT NULL, 
    PRIMARY KEY (
        quote_id,
        product_id
    )
) ENGINE=InnoDB DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;