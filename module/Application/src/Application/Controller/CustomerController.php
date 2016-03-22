<?php

namespace Application\Controller;

use Zend\Mvc\Controller\AbstractRestfulController;
use Zend\View\Model\JsonModel;

class CustomerController extends AbstractRestfulController
{
    public function getList()
    {
        // TODO: move this to a service
        $em = $this->getServiceLocator()->get('Doctrine\ORM\EntityManager');
        $data = $em->getRepository('Application\Entity\Customer')->findAll();
        
        // Build the view.
        $view = new JsonModel();
        $view->setVariables(array(
            'data' => $data
        ));
        return $view;
    }
}