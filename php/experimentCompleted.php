<?php

require "config.php";
require "common.php";



try 
	{
		$connection = new PDO($dsn, $username, $password, $options);
		
		
		
		$sql = "UPDATE usersprolific SET date_completed = CURRENT_TIMESTAMP , 
            completed = 1 ,
			surveyDemo = :demo
             WHERE id_participant = :id_participant";

			
			$stmt = $connection->prepare($sql);                                  
  
			$stmt->bindParam(':id_participant', $_POST['id_participant'], PDO::PARAM_INT);  
			$stmt->bindParam(':demo', $_POST['surveyDemo'], PDO::PARAM_LOB);
			$stmt->execute(); 
		
		echo json_encode($_POST['id_participant']);
		
	}

	catch(PDOException $error) 
	{
		echo json_encode( $sql . "<br>" . $error->getMessage());
	}
	

?>