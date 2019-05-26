# 05.웹서버 만들기

### 웹서버란?

클라이언트(웹브라우저)에서 HTTP 프로토콜로 요청한 정보를 처리한 후 응답을 보내주는 역할

- 노드의 http 기본 모듈을 사용하여 웹 서버 객체를 만들어 사용 할 수 있음.
- PC나 서버에 이더넷 카드가 여러개 있는 경우, 특정 IP를 지정하여 사용 할 수 있음

------

### Node의 http 기본 모듈

1. http 기본 모듈 사용

2. createServer() 메소드를 사용하여 server 객체 생성

   : listen, close 메소드를 사용

3. 클라이언트에서 데이터 요청에 따른 콜백 함수 등록

   : **connection**, **request**, close 이벤트 사용

   1. request 이벤트의 콜백함수에서 (req,res) 매개 변수 사용
   2. res객체에서 write,end 객체를 사용 할 시, end 메소드가 호출될 때 클라이언트로 응답 전송

[tip]

- request 이벤트를 사용하지 않고, createServer() 메소드 호출에서도 사용 가능

- 파일 응답을 위해 Content-Type 헤더 값을 [MIME Type](https://developer.mozilla.org/ko/docs/Web/HTTP/Basics_of_HTTP/MIME_types)으로 설정해주면 다양한 형식의 파일을 읽어서 응답 가능

- 파일을 Stream 객체로 읽어 들인 후 pipe() 메소드로 응답 객체와 연결하여 사용 가능

  : 다만 이 방법을 사용 하면, 헤더를 설정 할 수 없음

- 서버에서 다른 웹사이트의 데이터를 가져와 응답하기

  - get
    - http 모듈의 get() 메소드를 사용하여 가져 올 수 있음
    - data 이벤트로 수신하여, end 이벤트로 확인함
  - post
    - http 모듈의 request() 메소드를 사용하여 가져올 수 있음
    - 요청 파라미터는 request 객체의 data 속성으로 설정 가능 (ch05_test8) 
      : 이 속성 값에 따라 Content-Length 헤더 값이 달라짐
    - req.write()를 사용하여 본문을 작성하고 end() 메소드를 사용하여 요청함

------

### Express 사용 하기

express 모듈을 사용하면 http 모듈을 사용하여 설정하던 부분을 생략 할 수 있다.
express 모듈에서 제공하는 **미들웨어**, **라우터**를 사용하는 방법에 대해서 알아두면 좋다.

1. **Express Server 만들기**

   - npm install express

   - express 모듈은 http 모듈과 같이 사용해야한다.

     ```js
     Express server 객체 주요 메소드
     * set(name, value)                        : 서버 설정을 위한 속성 지정
     * get(name)                               : 서버 설정을 위해 지정한 속성을 꺼내옴
     * use([path], function, [function...])    : 미들웨어 함수 사용
     * get([path], function)                   : 특정 path로 요청된 정보를 처리
     ```

     - set() 메소드 사용 시, 예약어가 있어서 주의해야함

       ```
       env         : 서버 모드 설정
       views       : view가 들어있는 폴더, 배열 생성
       view engine : 디폴트로 사용할 view engine 설정 (보통 ejs / pug 사용)
       ```

       ex) view engine 이란? : 클라이언트에 보낼 응답 웹문서를 만들 때 사용

2. **미들웨어로 클라이언트 응답 보내기**

   - 미들웨어란?	: 	express에서 웹 요청과 응답에 관한 정보를 처리하도록 만든 독립 된 함수

     - app 객체에 use() 메소드를 사용하여 미들웨어 설정
     - 클라이언트의 요청은 등록된 미들웨어 순서대로 통과하여 요청 정보를 사용해 필요한 기능 수행

3. **Express의 요청 객체와 응답 객체 알아보기**

   ```
   Express 추가로 사용할 수 있는 메소드
   * send([body])                         :   클라이언트에 응답 데이터를 보냄 (HTML 문자열, Buffer                                           											객체, Json객체, Json배열)
   * status(code)                         :   http 상태 코드 반환, end()나 send() 같은 전송 메소                                           											  드를 추가로 호출해야 전송 가능
   * sendStatus(statusCode)               :   http 상태 코드 반환, 상태 메세지와 함께 전송
   * redirect([status], path)             :   웹 페이지 경로 강제 이동
   * render(view, [locals], [callback])   :   view engine 사용하여 문서를 만든 후 전송
   ```

4. **Express 요청 객체에 추가한 헤더와 파라미터 알아보기**

   ```
   Express의 요청 객체에 추가한 헤더와 파라미터
   * query        :   클라이언트에서 GET 방식으로 전송한 요청 파라미터 확인
   * body         :   클라이언트에서 POST 방식으로 전송한 요청 파라미터 확인 
   				   ( body-parser 같은 외장 모듈 사용 )
   * header(name) :   헤더 확인
   ```

   ​	

5. **자주 사용하는 미들웨어 종류**

   1. static 미들웨어

      - 외장 모듈로 만들어져 있어서 설치 필요
        `%npm install serve-static --save`

      - 특정 패스로 접근 할 수 있도록 도와줌
        ex) public폴더 하위에 index.html 파일이 있다면 http://localhost:3000/index.html 로 바로 접속 가능

        ```js
        예시코드(app7, public/login.html)
        var static = require('serve-static');
        ...
        app.use( static( path.join( __dirName, 'public' ) ) );
        ```

   2. body-parser 미들웨어

      - 클라이언트가 POST 방식으로 요청할 때 요청 파라미터를 파싱하여 요청 객체의 body 속성에 넣어 줌

      - ```js
        app.use(bodyParser.urlencoded( { extended : false } ));
        app.use(bodyParser.json());
        ```

6. **요청 라우팅 하기**

   1. 라우터란 ? 	: 	클라이언트의 요청 패스를 처리할 수 있는 곳으로 기능을 전달해주는 역할(라우팅)

      - 응답 처리 함수를 별도로 분리하여 만든 다음 get(), post() 메소드 호출하여 라우터로 등록

      - ```js
        // 라우터 객체 참조
        var router = express.Router();
        
        // 라우팅 함수 등록
        router.route('요청 패스').get('실행될 응답 처리 함수');
        router.route('/process/login').post(...);
        ...
        
        // 라우터 객체를 app 객체에 등록
        app.use('/', router);
        ```

      - router 객체의 자주 사용하는 메소드

        ```js
        * get(callback)     :   GET 방식 처리, 특정 패스 요청이 발생했을 때 사용할 콜백 함수 지정
        * post(callback)    :   POST 방식 처리, 특정 패스 요청이 발생했을 때 사용할 콜백 함수 지정
        * put(callback)     :   PUT 방식 처리, 특정 패스 요청이 발생했을 때 사용할 콜백 함수 지정
        * delete(callback)  :   DELETE 방식 처리, 특정 패스 요청이 발생했을 때 사용할 콜백 함수 지정
        * all(callback)     :   모든 요청 방식 처리, 특정 패스 요청이 발생했을 때 사용할 콜백 함수 지정
        ```

   2. url 파라미터 사용하기

      -  `/process/login/:{param}`  url 뒤에 파라미터를 추가 `req.params.{param}`으로 매칭
      - {param}을 토큰이라고 함

   3. ERROR Page

      ```js
      app.all('*', function ( req, res ) {
          res.status(404).send('<h1>ERROR - 페이지를 찾을 수 없습니다.</h1>');
      });
      ```

      - express-error-handler 미들웨어로 오류 페이지 보내기 가능

7. **쿠키와 세션 관리하기**

   1. 쿠키 처리하기

      - 쿠키는 클라이언트 웹 브라우저에 저장되는 정보로 일정 기간 동안 저장하고 싶을 때 사용
      - cookie-parser 미들웨어 사용 가능

   2. 세션 처리하기

      - 상태 정보를 저장하는 역할을 하지만, 쿠키와는 다르게 서버 쪽에 저장
      - express-session 미들웨어 사용

8. **파일 업로드 기능 만들기** 

   - **멀티 파트(multipart) 포맷**으로 된 파일 업로드 기능을 사용하여 파일 업로드 상태 확인 가능
     - 멀티파트 포맷은 음악이나 이미지 등을 일반 데이터와 함께 웹 서버로 보내려고 만든 표준
   - **multer 미들웨어** 사용 하여 파일 업로드 구현
   - 파일 업로드를 구현할 때, 클라이언트에서 POST 방식으로 데이터 전달을 하므로 **body-parser 미들웨어를 같이 사용**
   - 미들웨어 사용 순서 중요 body-parser -> multer -> router
   - destination 속성으로 지정한 폴더는 프로젝트 폴더 안에 만들어져 있어야 합니다. 