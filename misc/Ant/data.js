// [color][state]
// [paint, direction, state]
const RULE_TABLE = {"langton":{
    states:1,
    colors:2,
    rules:[[[1,1,0]],[[0,3,0]]]
  },"snowflake":{
    states:3,
    colors:2,
    rules:[[[1,3,1],[1,2,1],[0,0,0]],[[1,1,0],[1,2,2],[0,2,0]]]
  },"spiral":{
    states:2,
    colors:2,
    rules:[[[1,0,1],[1,1,1]],[[1,3,0],[0,0,0]]]
  },"fibonacci":{
    states:2,
    colors:2,
    rules:[[[1,3,1],[1,1,1]],[[1,3,1],[0,0,0]]]
  },"modernArt":{
    states:2,
    colors:2,
    rules:[[[1,3,0],[0,1,0]],[[1,1,1],[0,3,1]]]
  },"spaghetti":{
    states:2,
    colors:2,
    rules:[[[1,1,1],[1,1,1]],[[1,3,1],[0,1,0]]]
  },"galaxy":{
    states:2,
    colors:2,
    rules:[[[1,3,1],[0,3,0]],[[0,1,0],[0,3,0]]]
  }};