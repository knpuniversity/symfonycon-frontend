<?php

namespace Yoda\EventBundle\Reporting;

use Doctrine\Common\Persistence\ObjectManager;
use Symfony\Bridge\Monolog\Logger;

/**
 * Look mom, I'm a service!!!
 */
class EventReportManager
{
    private $em;

    private $logger;

    public function __construct(ObjectManager $em)
    {
        $this->em = $em;
    }

    public function getRecentlyUpdatedReport()
    {
        $this->logInfo('Generating the recently updated events CSV!!!');

        $events = $this->em
            ->getRepository('EventBundle:Event')
            ->getRecentlyUpdatedEvents()
        ;

        $rows = array();
        foreach ($events as $event) {
            $data = array($event->getId(), $event->getName(), $event->getTime()->format('Y-m-d H:i:s'));

            $rows[] = implode(',', $data);
        }

        return implode("\n", $rows);
    }

    public function setLogger(Logger $logger)
    {
        $this->logger = $logger;
    }

    private function logInfo($msg)
    {
        if ($this->logger) {
            $this->logger->info($msg);
        }
    }
}