# 프리온보딩 4주차 과제
## 🌐 배포 주소
### https://my-pre-onboard-12th-4.vercel.app/

## ⚙ 실행 방법

1. 프로젝트 내려받기 `git clone https://github.com/jypman/my-pre-onboard-12th-4.git ./`
2. 패키지 설치: `npm install`
3. 애플리케이션 실행: `npm start`


## 🙋‍about me

| 박진영                                                                                            |
|------------------------------------------------------------------------------------------------|
| <img src="https://avatars.githubusercontent.com/u/69949824?v=4.png" width="300" height="300"/> |
| [닉네임 : jypman](https://github.com/jypman)|

## 💻 과제 요구사항
https://lean-mahogany-686.notion.site/Week-4-6084fce47c804fbab67a2fb720bfa407


## 📁 프로젝트 디렉토리 구조
```
📦src
 ┣ 📂components
 ┃ ┣ 📜Button.tsx
 ┃ ┗ 📜Chart.tsx
 ┣ 📂mocks
 ┃ ┣ 📜data.json (chart mock data)
 ┣ 📂pages
 ┃ ┣ 📜Home.tsx
 ┃ ┣ 📜NotFound.tsx
 ┃ ┣ 📜Routes.tsx
 ┣ 📂providers
 ┃ ┗ 📜ChartProvider.tsx (chart 시각화 로직 제공)
 ┣ 📂styles
 ┃ ┣ 📜color.ts (프로젝트 공용 색상)
 ┣ 📂types
 ┃ ┣ 📜chart.ts (chart 관련 type)
 ┣ 📜App.tsx
 ┣ 📜index.css
 ┣ 📜index.tsx
 ┣ 📜logo.svg 
 ┣ 📜react-app-env.d.ts
 ┣ 📜reportWebVitals.ts
 ┗ 📜setupTests.ts
```

## 😁이 부분에 대해 고민해봤어요!
- **차트를 효과적으로 시각화하기 위해 D3 라이브러리 도입**
  - <span style="color:green;font-weight:bold">why?</span>
    - 데이터 시각화 시 svg를 효과적으로 표현하기 위해 사용
    - 타 라이브러리에 비해 데이터 시각화의 표현 자유도가 높음
 
- **차트의 view(JSX)와 로직 관심사 분리**
  - <span style="color:green;font-weight:bold">why?</span>
    - 추후 프로젝트의 확장 및 유지보수 목적을 하나로 제한하기 위함
    - 이를 통해 유지보수 용이
  - <span style="color:green;font-weight:bold">how?</span>
    - view는 Chart.tsx에서 관리
    - 차트의 상태값 및 기타 로직은 context api를 사용한 ChartProvider.tsx에서 관리
    - ChartProvider.tsx의 자식 컴포넌트에 위치한 컴포넌트는 <br/> useChartVal를 import하여 ChartProvider.tsx의 상태 값과 로직 사용가능
    - 그렇지 않은 경우 <br/>"<span style="color:red;font-weight:bold">useChartVal should be used within ChartProvider</span>"<br/> 에러를 던져 실수를 방지하여 개발자 경험 개선 


## 🛠사용한 라이브러리
<div>

영역|목록|
:--------:|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
**Frontend** | <img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black"> <img alt="Static Badge" src="https://img.shields.io/badge/D3-%23F9A03C?style=for-the-badge&logo=d3dotjs&logoColor=white"> <img src="https://img.shields.io/badge/styledcomponents-DB7093.svg?&style=for-the-badge&logo=styledcomponents&logoColor=white"> <img src="https://img.shields.io/badge/React Router-CA4245.svg?&style=for-the-badge&logo=reactrouter&logoColor=white"> 
</div>