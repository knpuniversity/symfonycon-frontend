<?php

namespace Yoda\EventBundle\Twig;

use Yoda\EventBundle\Util\DateUtil;

class EventExtension extends \Twig_Extension
{
    public function getFilters()
    {
        return array(
            'ago' => new \Twig_Filter_Method($this, 'ago'),
        );
    }

    public function ago(\DateTime $dt)
    {
        return DateUtil::ago($dt);
    }

    /**
     * Returns the name of the extension.
     *
     * @return string The extension name
     */
    public function getName()
    {
        return 'event';
    }

}