const admin = require('firebase-admin');

const serviceAccount = {
    "type": "service_account",
    "project_id": "sudoku-premium-a9954",
    "private_key_id": "4a4e5f2296cde31418f44a080544764681348519",
    "private_key": process.env.FIREBASE_PRIVATE_KEY
        ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
        : "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDyra8JrlkDwtLD\nSWGQfM5zAOO7S+qCpXzUen13Ws6E/GYKKdJR8oAiCrhcgxnkQ4tPHPqUwFA43NAD\nZnchzrd8t6CM8HVFIqJqyVi69Ubn+wz1rDIM8Dp3rkucpbMdBB2MQi+7PR9wfkMJ\nmx4FGjn/4ekUa7WBIMXE/ZJ2lKKoZES4oFLp3VJozQDDF5EiHek8gxBilPEgesZM\nwmbXyrmvYwKtXAjQJln9Kd6OX8jHY9Jscol0N48hWGkenvuPuH5fSI2c7TPSyYy/\nhe/XKu/5N1bCE13iPAxDeWyTMGPXG7xuG8qKoYIEM1dbbMQlThQv1bxqdifjb3h+\nAGiUZeelAgMBAAECggEAN/lsLW83rGioPO+Ez7Md2kRbArUyuOIrTgYXwOsixeVC\nsvbtAkZNHCz9U6dQlkgnDn8oZB2Mk2UJHLOqaFOaGmvvXfrLjb/8luVssCjJa1IK\nbfMDE11omvjKi23jx55Oo26TvFwPj56r30AWV0ZymMz2eiWS1p8kxrhXKz9C2lRd\nUqUUlpNITfjp4OfHjgrN1YZxWLIs4jBVJ7HPHuafYn6+oIuu+pQOq3nlGi6LCclz\nxm8w+LZKkCu85A4l0kYFDZQp3ZQ7B/oLdw0DQ7tvNckVNmKuwcBUSBJ1JLLKLu/r\nNWI/ceP92BMmRJi66OBKQgzcIzPQrE6Y2OHMPNfdIQKBgQD6oKMUVTEERxZif6aq\n9XE+PdkzKn/um7J+5Y+jqsNQCz0DAVHCTD0DKUYuNp1BuRdwa1zQVO/atnoekRkE\nsnb5qhvmBTVemnTcjP4palj2iwZonou2nCYr5P5Q3wH4xYhTi4UU6x+rcjSq/DZB\nJm2ACGK7d6VabgTqhYOUw2XkBQKBgQD34WzKNNZ1oRXNUTyJFWLt0yfu/Y2Kxl6a\nxGppPJ9Sn70h7oPNuA8rLz8VbumQb8zKVA1SDgxP03GT1xGlPtCp6K8fL7umY93C\nolr1aZhJ/ziZB8dcrs7yNT01uPMkXRoQoj5K5MuXmEYTYbTq5IFkFNXQf9vb+Xcv\nj29MV+fnIQKBgQDBcattzjN/Mb89V3m1CqzVdbdnnq4P5WzoNRehI/SMm6AD6cjJ\nRz7wabMZiF3olIxa4QNKacSX87BeV3AQCA98tKfD6tE+q8j3Unv6S3NPGA9iQL1l\nvTBZQO5qTTagZRbMJSwa8UAIfKXaM8FMl/R8lfxe5gJiwfhZa6Qb9pV2YQKBgQDC\nlY0G9o9ba4Zn1FuG6Ojt9JImg5e21p2xNHqr/dC71XVsy4Vf2hreNYp50sU6gujp\n8y05upljmIJSIcRSSYsXtfayro/JwB93CGgKuke33seZKYgQc5E0hSJ1p6gGZadu\nY04vEIfZismHsW2J7rK707c8owH+Hki3ZwthjKgYwQKBgCPjZdtya8sVQv+R2ZYp\nxYFtEITXSSrnbYWDLtDcOCGzw9jpc/Y+n351/fjUpeE75R79sL93OMAOJ451f6T2\ng35twGL0lmIuDYt1anpkUCaoGphsWoMbbRiy7ujbzK6pNP9T2ZjpsjtnSjkppH8p\nk6IwC5gx/LLXus4PGg9hka7c\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-fbsvc@sudoku-premium-a9954.iam.gserviceaccount.com",
    "client_id": "110025183796408997537",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40sudoku-premium-a9954.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
};

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const auth = admin.auth();

module.exports = { admin, db, auth };
