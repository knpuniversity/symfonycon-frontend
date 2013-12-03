<?php

namespace Yoda\EventBundle\Util;

use DateTime;

class DateUtil
{
    /**
     * Returns the "ago" version of a date time
     *
     * @static
     * @param \DateTime $dt
     * @return string
     */
    static public function ago(DateTime $dt)
    {
        $time = $dt->format('U');

        $periods = array('second', 'minute', 'hour', 'day', 'week', 'month', 'year', 'decade');
        $lengths = array('60','60','24','7','4.35','12','10');

        $now = time();

        $difference     = $now - $time;
        $tense         = 'ago';

        for($j = 0; $difference >= $lengths[$j] && $j < count($lengths)-1; $j++) {
            $difference /= $lengths[$j];
        }

        $difference = round($difference);

        if($difference != 1) {
            $periods[$j].= 's';
        }

        return sprintf('%s %s %s ', $difference, $periods[$j], $tense);
    }
}