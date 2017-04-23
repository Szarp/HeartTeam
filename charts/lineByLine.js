var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('/Users/bartek/Documents/10s_hr.txt')
});
//var index=0;
//var last=0;
//var parsedLine=0;

/*
lineReader.on('line', function (line) {
    
    parsedLine=Number(line);
    minMax(parsedLine);
    dPath+=makePoint(index,parsedLine);
    index++;
    //do some stuff
    //console.log(parsedLine+";"+last);
    last=parsedLine;
  //console.log('Line from file:', Number(line));
});
lineReader.on('close', function (line) {
    //console.log(dPath);
   // console.log(min,max);
});
*/
minMaxValue(function(minMax){
    //console.log(a[0]);
    var min=minMax[0]
    //console.log(min);

    
});
    substarctMin(10108,function(q){
        console.log(q);
    });
function makePoint(index,yPos){
    return ' L'+index*5+' '+yPos;
}

function substarctMin(min,callback){
    var dPath='M0 0';
    var index=0;
    lineReader.on('line', function(line){
        parsedLine=Number(line);
        //minMax(parsedLine);
        dPath+=makePoint(index,parsedLine-min);
        index++;
        //do some stuff
        //console.log(parsedLine+";"+last);
        //last=parsedLine;
      //console.log('Line from file:', Number(line));
    });
    lineReader.on('close', function (line) {
        setImmediate(function() {
            callback(dPath);
        });
        //console.log(dPath);
       // console.log(min,max);
    });
    
}
function minMaxValue(callback){
    var min;
    var max;
    var index=0;
    var number;
    lineReader.on('line', function (line) {
        number=Number(line);
        if(index==0){
            min=number;
            max=number;
        }
        if(min > number)
            min=number;
        if(max < number)
            max=number;
        index++;
    });
    lineReader.on('close', function (line) {
        //console.log(dPath);
        setImmediate(function() {
            callback([min,max]);
        });
   // console.log(min,max);
    });


    
    
}