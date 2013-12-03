<?php

namespace Yoda\EventBundle\Controller;

use Symfony\Bundle\TwigBundle\Controller\ExceptionController as BaseController;
use Symfony\Component\HttpKernel\Exception\FlattenException;
use Symfony\Component\HttpKernel\Log\DebugLoggerInterface;

class ExceptionController extends BaseController
{
    private $exceptionClass;

    public function showAction(FlattenException $exception, DebugLoggerInterface $logger = null, $format = 'html')
    {
        $this->exceptionClass = $exception->getClass();

        return parent::showAction($exception, $logger, $format);
    }

    protected function findTemplate($templating, $format, $code, $debug)
    {
        if (!$debug && $this->exceptionClass == 'Yoda\EventBundle\Exception\EventNotFoundException') {
            return 'EventBundle:Exception:error404.html.twig';
        }

        return parent::findTemplate($templating, $format, $code, $debug);
    }


}