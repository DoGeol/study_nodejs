# study_nodejs
Do it! Node Js Study


##2장  Node Module
Module : 별도의 파일로분리된 독립 기능의 모음<br>
함수를 여러개로 나누어 필요할때 가져와 사용하면 재사용 할 수 있다.<br>
노드에서는 모듈이라는 단위로 별도의 파일을 만들어 필요한 파일에서 불러와서 사용 할 수 있다.
이 과정에서 exports 전역 객체 사용
모듈을 불러올 때 require() 메소드를 사용하며, 파라미터로 파일의 이름을 사용

외장 모듈 사용 (node_modules)<br>
npm install {package} : 모듈 설치 (--save 사용하여 package.json 추가 가능)<br>
npm init : npm package 관리를 위한 package.json 파일 생성<br>

[tip]다른 프로젝트에서 모듈 사용을 원한다면 package.json 파일을 옮긴 후 npm install
그럼 dependencies 속성값을 참조하여 패키지 설치

내장 모듈<br>
시스탬 정보를 알려주는 os 모듈

