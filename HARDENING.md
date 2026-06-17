# Tableau `.twb` Hardening

현재 생성기는 Tableau 워크북의 필수 구조를 자동 테스트하지만 Tableau Desktop에서 실제로 파일이 열리는지는 실측하지 못했다. 코드의 추정 속성은 숨기지 않고 이 문서의 검증 대상으로 관리한다.

관련 공개 분석 기록은 [`docs/tableau-reverse-engineering/`](./docs/tableau-reverse-engineering/README.md)에 유지한다.

## Desktop diff로 확인해야 하는 항목

### 절차

1. Tableau Desktop에서 `examples/example.json`과 같은 차트를 만든다.
   - CSV: `examples/sales.csv`
   - Columns: `Region`
   - Rows: `SUM(Sales)`
   - Sort: 내림차순
   - Mark: Bar
2. 워크북을 `.twb`로 저장한다.
3. `npm run demo`로 `dist/output.twb`를 생성한다.
4. Tableau Desktop이 저장한 파일과 PlotIR 출력을 구조적으로 diff한다.
5. 아래 체크리스트의 실제 값을 확정하고 코드, 스냅샷, 이 문서를 함께 갱신한다.

### 체크리스트

1. **datatype**
   - 정수 컬럼이 `real`인지 `integer`인지 확인한다.
   - 현재 코드는 IR의 `number`를 모두 `real`로 하드코딩한다.
2. **column-instance 누락**
   - rows, cols, marks의 모든 pill에 대응하는 `<column-instance>`가 있는지 확인한다.
   - 누락은 파일이 열리지 않는 가장 유력한 원인이다.
   - 자동 테스트가 이 1:1 대응을 검사하지만 Desktop 출력과 이름 규칙도 대조해야 한다.
3. **version / source-build**
   - 사용자 Tableau Desktop 버전과 현재 하드코딩한 `version='18.1'`의 호환성을 확인한다.
   - Desktop 출력에 `source-build`가 있다면 필요한 값과 위치를 확정한다.
4. **textscan connection 속성**
   - 실제 파일의 `directory`, `separator`, `header` 등 환경 의존 속성을 확인한다.
   - 현재 코드는 `<connection class='textscan' filename='...'>`에 필요한 최소 추정값만 둔다.
5. **federated/textscan 구조**
   - Desktop 출력의 `<connection class='federated'> → <named-connections> → <named-connection> → <connection class='textscan'>` 래퍼 계층과 현재 출력을 대조한다.

## 완료 기준

- PlotIR 출력 `.twb`가 대상 Tableau Desktop 버전에서 오류 없이 열린다.
- Region이 Columns, SUM(Sales)가 Rows에 있고 Bar mark로 표시된다.
- Desktop 재저장 전후에 pill과 datasource dependency가 유지된다.
- 확정한 속성은 회귀 테스트와 XML 스냅샷에 반영한다.
