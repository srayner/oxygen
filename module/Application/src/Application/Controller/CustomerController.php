<?php

namespace Application\Controller;

use Zend\View\Model\JsonModel;

class CustomerController extends AbstractRestController
{
    public function getList()
    {  
        // Grab the data and return a Json view model.
        return new JsonModel(array(
            'data' => $this->em->getRepository('Application\Entity\Customer')->findAll()
        ));
    }
}