<?php

namespace Application\Entity;

use Doctrine\ORM\Mapping as ORM;

/** @ORM\Entity
  * @ORM\Table(name="product")
  */
class Product
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     * @ORM\Column(type="integer")
     */
    protected $id;
    
    /** @ORM\Column(type="string") */
    protected $category;
    
    /** @ORM\Column(type="string") */
    protected $code;
    
    /** @ORM\Column(type="string") */
    protected $description;
    
    /**
     * @ORM\ManyToOne(targetEntity="Supplier")
     * @ORM\JoinColumn(name="supplier_id", referencedColumnName="id")
     */
    protected $supplier;
    
    /** @ORM\Column(type="string") */
    protected $supplierCode;
    
    /** @ORM\Column(type="decimal", name="list_price") */
    protected $listPrice;
    
    /** @ORM\Column(type="decimal") */
    protected $discount;
    
    /** @ORM\Column(type="string") */
    protected $grouping;
    
    public function getId()
    {
        return $this->id;
    }

    public function getCategory()
    {
        return $this->category;
    }

    public function getCode()
    {
        return $this->code;
    }

    public function getDescription()
    {
        return $this->description;
    }

    public function getSupplier()
    {
        return $this->supplier;
    }

    public function getSupplierCode()
    {
        return $this->supplierCode;
    }

    public function getListPrice()
    {
        return $this->listPrice;
    }

    public function getDiscount()
    {
        return $this->discount;
    }

    public function getGrouping()
    {
        return $this->grouping;
    }

    public function setId($id)
    {
        $this->id = $id;
        return $this;
    }

    public function setCategory($category)
    {
        $this->category = $category;
        return $this;
    }

    public function setCode($code)
    {
        $this->code = $code;
        return $this;
    }

    public function setDescription($description)
    {
        $this->description = $description;
        return $this;
    }

    public function setSupplier($supplier)
    {
        $this->supplier = $supplier;
        return $this;
    }

    public function setSupplierCode($supplierCode)
    {
        $this->supplierCode = $supplierCode;
        return $this;
    }

    public function setListPrice($listPrice)
    {
        $this->listPrice = $listPrice;
        return $this;
    }

    public function setDiscount($discount)
    {
        $this->discount = $discount;
        return $this;
    }

    public function setGrouping($grouping)
    {
        $this->grouping = $grouping;
        return $this;
    }

}

