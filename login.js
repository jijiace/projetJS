const logUrl = "http://localhost:5678/api/users/login";

document.getElementById('loginForm').addEventListener('submit', function(event) {
  
    event.preventDefault();

   
    document.getElementById('emailError').textContent = '';
    document.getElementById('emailError').style.display = 'none';
    document.getElementById('passwordError').textContent = '';
    document.getElementById('passwordError').style.display = 'none';

  
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

   
    let isValid = true;
    if (!email) {
        document.getElementById('emailError').textContent = 'Veuillez entrer votre adresse email.';
        document.getElementById('emailError').style.display = 'block';
        isValid = false;
    }
    if (!password) {
        document.getElementById('passwordError').textContent = 'Veuillez entrer votre mot de passe.';
        document.getElementById('passwordError').style.display = 'block';
        isValid = false;
    }
    if (!isValid) {
        return;
    }

    
    const formData = {
        email: email,
        password: password
    };

    fetch(logUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Identifiants incorrects.');
            } else {
                throw new Error('Erreur lors de la requête vers l\'API.');
            }
        }
        return response.json();
    })
    .then(data => {
      
        console.log(data);
        localStorage.setItem("token", data.token);
        window.location.href = "index.html";
    })
    .catch(error => {
       
        console.error('Erreur:', error.message);
        if (error.message === 'Identifiants incorrects.') {
            document.getElementById('passwordError').textContent = 'Adresse email ou mot de passe incorrect.';
            document.getElementById('passwordError').style.display = 'block';
        } else {
            alert('Une erreur est survenue. Veuillez réessayer plus tard.');
        }
    });
});
