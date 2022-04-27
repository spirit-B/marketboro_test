# marketboro_test
해당 과제는 Node.js 플랫폼의 express 프레임워크를 이용해 구현했습니다.
데이터베이스는 MongoDB를 사용했습니다.

## 동작 방법
(vscode 환경에서의 작동 기준입니다.)
<details>
  <summary> 1. 확장에서 Thunder Client를 설치합니다.</summary>
  <img src="https://user-images.githubusercontent.com/79096544/165519181-6c662e7d-818f-4a6c-b35e-a20c7451a541.PNG">
</details>

<details>
  <summary> 2. 새 터미널을 열고 'node app.js'로 서버를 실행합니다.</summary>
  <img src="https://user-images.githubusercontent.com/79096544/165521325-84cccfc8-9ee2-45e1-af34-3475a5e32e33.PNG">
</details>

<details>
  <summary> 3. 서버가 실행되면, thunder client에서 각 API를 테스트하면 됩니다.</summary>
  <img src="https://user-images.githubusercontent.com/79096544/165521325-84cccfc8-9ee2-45e1-af34-3475a5e32e33.PNG">
  <img src="https://user-images.githubusercontent.com/79096544/165526527-dda253ce-9387-40d4-a7ed-baef6a94be86.PNG">
</details>

<details>
  <summary> 4. 로그인이 필요한 API의 경우에는 아래와 같이 테스트하면 됩니다. </summary>
  <br>로그인 후 나오는 토큰을 Auth 탭의 Bearer에 넣습니다.
  <img src="https://user-images.githubusercontent.com/79096544/165527233-7feec166-e26f-4514-99af-b96d26659638.PNG">
  <img src="https://user-images.githubusercontent.com/79096544/165527252-0c4ed675-18c9-4cfb-b882-eabbef89e84d.PNG"></br>
  <br>POST method의 경우에는 Body 탭에서 schemas의 형식으로 json 데이터를 넣고 send를 하면 결과가 아래에 나옵니다.
  <img src="https://user-images.githubusercontent.com/79096544/165527651-601d7d11-e089-4011-ae4d-4cb012287b2a.PNG"></br>
</details>

## 설명
### 개발 필수요건
1. 상품관리
* 상품의 등록/수정/삭제는 각각 post, patch, delete method를 사용했습니다.

2. 주문관리
* 등록한 상품은 사용자가 한 번 주문할 때 여러가지의 상품을 동시에 주문이 가능하도록 구현했습니다.
* 각 주문은 각각 고유의 index가 존재해 일부 상품을 주문취소 할 수 있습니다.
* 주문상태는 주문이 접수된 순간 바로 '주문접수'상태로 등록이 되며, 주문이 취소될 경우에는 DB에서 해당 테이블을 삭제했습니다.
* 배송완료 제외 각 주문 상태별로 메세지를 콘솔 로그 출력으로 구현했습니다. (배송완료 부분은 구현하지 못했습니다.)

### 개발 추가요건
* 인증/인가
  * Bearer 기반 JWT를 이용해 회원가입과 로그인을 구현했습니다.
  * 회원의 비밀번호는 crypto-js 모듈을 이용, AES 알고리즘을 사용해 암호화하여 데이터베이스에 저장하도록 했습니다.
* 로그인 사용자 관리
  * 로그인한 사용자는 ID/PW 찾기, PW 수정을 할 수 있습니다.
  * ID/PW 찾기를 이용할 경우 -> nodemailer 모듈을 이용해 사용자가 가입할 당시 기입했던 메일 주소로 ID와 PW를 자동으로 보내도록 했습니다. 이때 PW는 별도의 로직을 이용해 임시 비밀번호를 보내주도록 했습니다.
* 예외처리
  * 로그인한 사용자만 상품등록이나 주문을 가능하게 구현했습니다.
  * 회원가입 시, 회원의 ID와 PW를 joi 모듈을 사용해 정해진 정규표현식 검증을 하도록 구현했습니다. (ID는 영어 대소문자 및 숫자포함 6 ~ 16자, PW는 영어 대소문자 및 숫자, 특수문자(!@#$%^*_-)를 최소 하나씩 사용해야 하며, 8 ~ 16자로 구성)
  * 로그인한 사용자만 상품을 등록/수정/삭제 및 주문이 가능하게 구현했으며, 특히 상품의 수정 및 삭제는 자신이 등록하지 않은 상품 외에는 불가능하도록 예외처리 하였습니다. 배송이 완료된 주문에 대해서도 취소할 수 없도록 했습니다.
