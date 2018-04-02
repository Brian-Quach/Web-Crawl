(function(){
    "use strict";

    window.addEventListener('load', function(){

        function submit(){
            console.log(document.querySelector("form").checkValidity());
            if (document.querySelector("form").checkValidity()){
                var username = document.querySelector("form [name=username]").value;
                var password =document.querySelector("form [name=password]").value;
                var action =document.querySelector("form [name=action]").value;
                api[action](username, password, function(err, res){
                    if (err) console.log(err);
                    else window.location = '/';
                });
            }
        }

        document.querySelector('#signIn').addEventListener('click', function(e){
            document.querySelector("form [name=action]").value = 'signIn';
            submit();
        });

        document.querySelector('#signUp').addEventListener('click', function(e){
            document.querySelector("form [name=action]").value = 'signUp';
            submit();
        });

        document.querySelector('form').addEventListener('submit', function(e){
            e.preventDefault();
        });
    });
}());


