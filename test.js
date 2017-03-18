var http = require('https')
const request = require('request')
let sender=1290431287706737
let token = "EAART7lC1g3wBAJsN4lwkRWU6kyH41jTKbha4ARWSwQNndb48TIeKif5eLNcKOQItJmhMv44ZABLN1gEeFW3g6ZCH07sYPzPPAgNMf8NTn0MDcIDZAIdo7gJeooCYzLsIVVUvq0wxiIA1FyJZBemH0rQj7UzsMZB4DJoZB16LFXGAZDZD"
let url='https://graph.facebook.com/v2.6/' + sender +'?access_token=EAART7lC1g3wBAJsN4lwkRWU6kyH41jTKbha4ARWSwQNndb48TIeKif5eLNcKOQItJmhMv44ZABLN1gEeFW3g6ZCH07sYPzPPAgNMf8NTn0MDcIDZAIdo7gJeooCYzLsIVVUvq0wxiIA1FyJZBemH0rQj7UzsMZB4DJoZB16LFXGAZDZD'
console.log(url)


var test= http.get(url,function(data){
	console.log(data);
})

/*const options = {  
  method: 'GET',
  uri: url,
  qs: {
   access_token: token,
  }
}

request(options,function (response) {
    console.log(response)// Request was successful, use the response object at will
  })
*/