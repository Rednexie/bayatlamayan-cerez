#Çözüm


### Git klasörünü bulma
Sunucu, .git klasörünü statik bir şekilde herkese açtığı için bu klasöre erişim mümkündü. Dizin tarama araçları ile tarama yapılabilirdi. 


### Repository'i bulma
.git klasöründeki config dosyasından repository bulunabilirdi:

```
[core]
        repositoryformatversion = 0
        filemode = true
        bare = false
        logallrefupdates = true
[remote "origin"]
        url = https://github.com/linustorvalds1453/express-libsql-login
        fetch = +refs/heads/*:refs/remotes/origin/*
[branch "main"]
        remote = origin
        merge = refs/heads/main


```

https://github.com/linustorvalds1453/express-libsql-login

### Veritabanını bulma
Repository'de cerez.sqlite adında bir dosya bulunmakta. 

### Repository kodunun analizi
Kod okunup analiz edilerek, uygulamanın `leblebi` isimli çerez değerini kullanıcı kayıt olduğunda oluşturarak ve giriş yaptığında veritabanından alınarak ayarlandığı anlaşılırdı. 
modules/encrypt.js içindeki fonksiyonun sunucu tarafından kullanıldığı görülebilirdi. Şifrelemede kullanılan anahtar ise .env dosyasından bulunabilirdi. 

Ardından istenilen yazılım dilinde bir script yazılabilirdi. Script:

- Önce veritabanını açar
- Her satır için teker teker satırdaki çerez değerinin şifresini çözer. 
- Cookie'deki leblebi değerini ayarlayacak şekilde isteği gönderir. 



Farklı cevap kodu döndüren kullanıcının çereziyle giriş yapılarak bayrak alınırdı

