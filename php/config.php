<?php

/**
 * Configuration for database connection
 *
 */
/*Test*/
$host       = "localhost";
$username   = "root";
$password   = "root";

/*PRODUCTION
$host       = "localhost";
$username   = "root";
$password   = "MolE2XWh3rSS";
*/
/**/


$dbname     = "milenaWL";
$dsn        = "mysql:host=$host;dbname=$dbname";
$options    = array(
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
              );

              