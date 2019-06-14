

<?php



require "config.php";
require "common.php";


try 
	{

$connection = new PDO($dsn, $username, $password, $options);
		
		
		$sql = "UPDATE usersprolific SET
			 trials = :trials
             WHERE id_participant = :id_participant";

			
			$stmt = $connection->prepare($sql);                                  
  
			$stmt->bindParam(':id_participant', $_POST['participantId'], PDO::PARAM_INT);  
			$stmt->bindParam(':trials', $_POST['trials'],  PDO::PARAM_LOB );
			$stmt->execute(); 
		
		echo json_encode($_POST['participantId']);

	}

	catch(PDOException $error) 
	{
		echo $sql . "<br>" . $error->getMessage();
	}
	

?>