AttendMe – Aplikacja do sprawdzania obecności przy użyciu kodów QR

Dawid Nosek 15203

1. Technologie

- Vue 3
- Composition API
- TypeScript
- Pinia (zarządzanie stanem)
- Vue Router (routing + layouty)
- Tailwind CSS (stylowanie)

2. Dane logowania

Wykładowca

login: teacher
hasło: 123

Student

login: student
hasło: 123

2.1 Uruchomienie projektu:
npm install
npm run dev

Aplikacja uruchomi się pod adresem:

http://localhost:5173

3. Zaimplementowane funkcjonalności:

Wykładowca:

- Logowanie
- Pulpit z listą zajęć (filtry: wszystkie / dziś / jutro)
- Szczegóły zajęć
- Ręczna zmiana obecności studentów (toggle)

Student:

- Logowanie
- Ekran autoryzacji urządzenia (device authorization)
- Pulpit z listą zajęć
- Generowanie kodu QR dla zajęć
- Podgląd statusu obecności

4. Informacje techniczne projektu:

- Projekt wykorzystuje mockowane dane (brak aktywnego backendu)
- Stan aplikacji przechowywany jest w Pinia
- Autoryzacja urządzenia studenta realizowana jest poprzez guard routingu
- Funkcja skanowania kodu QR po stronie wykładowcy nie była wymagana zgodnie z minimalnym zakresem projektu

5. Zakres projektu

- Vue 3 + Composition API + TypeScript
- Routing z layoutami
- Globalny stan poza drzewem komponentów
- Podział na komponenty SFC
- Obsługa błędów
- Stylowanie przy użyciu zewnętrznej biblioteki
