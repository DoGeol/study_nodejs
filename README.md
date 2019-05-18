### 4장 Node의 기본기능 알아보기
학습목표 : 이벤트가 무엇인지 알아보자
1. 주소 문자열과 요청 파라미터 다루기
주소 문자열을 다루기 위해 노드의 기본 모듈인 'url 모듈' 사용
url 모듈을 이용해 주소 문자열을 객체로 만들면, 정보를 나누어 객체의 속성으로 보관
ex) 요청 프로토콜이 http, https 인지 구별하려면 url 객체가 가지고있는 속성 값을 확인하면 됌

* url 모듈
에서 문자열을 객체로 만들기 위해 자주 사용하는 메소드
[주요 메소드]
parse() : 주소 문자열을 파싱하여 URL 객체를 만들어줌
format() : URL 객체를 주소 문자열로 변환

* 요청 파라미터 확인
querystring 모듈을 이용
[주요 메소드]
parse() : 요청 파라미터 문자열을 파싱하여 요청 파라미터 객체로 만듦
stringify() : 요청 파라미터 객체를 문자열로 변환

####4-2 이벤트 이해하기
노드는 대부분 이벤트를 기반으로 비동기 방식으로 처리함
비동기 방식으로 처리하기 위해 이벤트를 전달 -> EventEmitter 라는 것을 사용해 이벤트를 주고 받음

노드의 객체에 EventEmitter를 상속받고, on(), emit() 메소드를 사용 할 수 있다.
on(event, listener) : 지정한 이벤트의 리스너를 추가 ( 이벤트가 전달될 객체에 이벤트 리스너를 설정하는 역할)
once(event, listener) : 지정한 이벤트 리스너를 추가하지만 한번 실행 후 자동 제거 
removeListener(event, listener) : 지정한 이벤트 리스너 제거

emit(evnet) : 이벤트를 전달함

#####파일 다루기
동기식 IO(Sync) / 비동기식 IO
fs 모듈 이용 -> readFile 메소드를 사용(비동기) / readFileSync 메소드를 사용(동기)

파일을 읽고 쓰는 대표적인 네가지 메소드
readFile(filename, [encoding], [callback]) : 비동기식 IO로 파일을 읽어 들입니다.
readFileSync(filename, [encoding]) : 동기식 IO로 파일을 읽어 들입니다.
writeFile(filename, data, encoding='utf8', [callback]) : 비동기식 IO로 파일을 씁니다.
writeFileSync(filename, data, encoding='utf8') : 동기식 IO로 파일을 씁니다.

파일을 직접 열고 닫으면서 일부분만 읽거나 쓰기 위한 메소드
open(path, flags, [mode], [callback]) : 파일을 엽니다.
read(fd, buffer, offset, length, position, [callback]) : 지정한 부분의 파일 내용을 읽어 들입니다.
write(fd, buffer, offset, length, position, [callback]) : 파일의 지정한 부분에 데이터를 씁니다.
close(fd, [callback]) : 파일을 닫아줍니다.

파일을 열때 사용하는 대표적인 플래그
'r' : 읽기에 사용하는 플래그, 파일이 없으면 예외 발생
'w' : 쓰기에 사용하는 플래그, 파일이 없으면 만들어지고 파일이 있으면 이전 내용을 모두 삭제
'w+' : 읽기와 쓰기에 모두 사용하는 플래그, 파일이 없으면 만들어지고 파일이 있으면 이전 내용을 모두 삭제
'a+' : 읽기와 쓰기에 모두 사용하는 플래그, 파일이 없으면 만들어지고 파일이 있으면 새로운 내용을 추가




