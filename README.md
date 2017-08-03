# Achieve it! (Mobile Apps Projekt Gruppe 1)
Ausführen der Anwendung:
1. ´npm install´
2. ´ionic serve´ (im Browser) oder ´ionic cordova emulate android´ (auf einem Android Emulator)

Die Präsentation und das Video sind im Ordner `Presentation` oder unter [Link](https://htmlpreview.github.io/?https://github.com/Jerobeam/Mobile-Apps-Project-Gruppe-1/blob/master/Presentation/index.html#simplequote) zu finden.
Die Individualprojekte liegen in `Individualprojekte`. Der Deeplink der App lautet "achieveit://app.com".


Beteiligt am Projekt waren:
- Lucas Groß-Hardt (4719129)
- Julia Rosenboom (MAT_GOES_HERE)
- Sebastian Röhling (4502972)

# Individualprojekte
## Sebastian Röhling (4502972)
Zu finden unter `Individualprojekte/Röhling`.

Inhalt:
- Android Tutorial
  - Inhalt:
    - Ausführbare Android App
    - Unit-Tests
- Cordova App
  - Ausführbar mit `cordova run`
  - Funktionsumfang:
    - Bilderaufnahme und -anzeige (Funktioniert im Browser und für Android mit einer SDK-Version unter 24. Für eine höhere Version müsste ein FileProvider implementiert werden)
- Framework 7 App
  - Ausführbar mit `cordova emulate android` und/oder `cordova run browser`
  - Funktionsumfang:
    - Google Maps & Standortabfrage
    - Bildaufnahme (Das Bild wird allerdings nur im Browser korrekt angezeigt)
    - Batteriestatusanzeige
    - Universal Link
    - Auslesen der Bildschirmausrichtung
    - SMS-Integration


## Lucas Groß-Hardt (4719129)
Zu finden unter `Individualprojekte/Groß-Hardt`

Inhalt:
- Android Tutorial App `myFirstApp`
  - Inhalt:
    - Ausführbare Android App
- Ionic App `myApp`
  - Ionic-Installation benötigt
  - npm install benötigt, um dependencies zu installieren
  - Ausführbar mit `ionic run browser`, dazu zunächst `cordova platform add browser` ausführen 
  - mit Ionic 3 u.U. `ionic cordova run browser`
  - Ausführbar mit `ionic run android` bei angeschlossenem Androidgerät
  - mit Ionic 3 u.U. `ionic cordova run android`
  - Funktionsumfang:
    - Bilderaufnahme und -anzeige
    - Auslese des Batteriestatus (einmal Menü triggern nötig um Status anzuzeigen)
    - Auslese der Internetverbindung (einmal Menü triggern nötig um Status anzuzeigen)
    - Standortabfrage
    - Orientierung (Ausrichtung des Geräts)
    - Share-Funktion für Fotos (Whatsapp, E-Mail, )
    - Kontaktliste in App anzeigen (+ Kontakte löschen und neu anlegen)
