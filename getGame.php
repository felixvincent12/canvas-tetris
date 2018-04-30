<?php 

error_reporting(E_ALL & ~E_NOTICE);

if(isset($_GET['name'])) 
{
$name = $_GET['name'];
}

if(isset($_GET['score']))
{
$score = $_GET['score'];
}

if(isset($name)&&isset($score)){
	if(!file_exists('score.xml'))
	{
	
	//create new DomDocument
	$domtree = new DOMDocument('1.0','UTF-8');
	
	//format the output and do not preserveWhiteSpace
	$domtree->formatOutput = true;
	$domtree->preserveWhiteSpace = false;
	$xmlRoot = $domtree->createElement("Players");

	//insert all the value into goods.xml
	$xmlRoot = $domtree ->appendChild($xmlRoot);

	$currentTrack = $domtree->createElement("Player");
	$currentTrack = $xmlRoot->appendChild($currentTrack);
	
	$Name = $domtree->createElement("Name");
	$Name->appendChild($domtree->createTextNode($name));
	$Name = $currentTrack->appendChild($Name);
	
	$Score = $domtree->createElement("Score");
	$Score->appendChild($domtree->createTextNode($score));
	$Score = $currentTrack->appendChild($Score);
	
	
	//save the file
	$domtree->save('score.xml');
	}
	else
	{
	$domtree = new DOMDocument('1.0','UTF-8');
	$domtree->formatOutput = true;
	$domtree->preserveWhiteSpace = false;
	
	//load the file
	$xmlroot = $domtree->load('score.xml');
	
	
	$nodes = $domtree->getElementsByTagName('Player');
	
	$Player = $domtree->getElementsByTagName('Player')->item(0);
	$Name = $Player->getElementsByTagName('Name')->item(0);
	$Score = $Player->getElementsByTagName('Score')->item(0);
	
	$new = $domtree->createElement('Player');
	
	//insert all the value of new item
	$Name = $domtree->createElement("Name");
	$Name->appendChild($domtree->createTextNode($name));
	$Name = $new->appendChild($Name);
	
	$Score = $domtree->createElement("Score");
	$Score->appendChild($domtree->createTextNode($score));
	$Score = $new->appendChild($Score);
	
	$domtree->getElementsByTagName('Players')->item(0)->appendChild($new);
	
	//save the file
	$domtree->save('score.xml');
	}
	
	
	$score = "";
}

	if(file_exists("score.xml"))
	{
	$xml=simplexml_load_file("score.xml");
	$last_one = $xml->xpath('//Player[last()]');
	$last_two = $xml->xpath('//Player[last()-1]');
	$last_three = $xml->xpath('//Player[last()-2]');
	$last_four = $xml->xpath('//Player[last()-3]');
	$last_five = $xml->xpath('//Player[last()-4]');

	$table = '<font size = "20"><table border="1" id="tableScore" class="score table table-condensed table-bordered" style="border: 5px solid black;"><tr><th>Name</th><th>Score</th></tr>';
	
	
	$table .="<tr><td>".$last_one[0]->Name."</td><td>".$last_one[0]->Score."</td></tr>";
	if($last_two[0]->Name && $last_two[0]->Score)
	{
	$table .="<tr><td>".$last_two[0]->Name."</td><td>".$last_two[0]->Score."</td></tr>";
	}
	if($last_three[0]->Name && $last_three[0]->Score)
	{
	$table .="<tr><td>".$last_three[0]->Name."</td><td>".$last_three[0]->Score."</td></tr>";
	}
	if($last_four[0]->Name && $last_four[0]->Score)
	{
	$table .="<tr><td>".$last_four[0]->Name."</td><td>".$last_four[0]->Score."</td></tr>";
	}
	if($last_five[0]->Name && $last_five[0]->Score)
	{
	$table .="<tr><td>".$last_five[0]->Name."</td><td>".$last_five[0]->Score."</td></tr>";
	}
	
	$table .="</table></font>";
	
	echo $table;
	}

	
?>