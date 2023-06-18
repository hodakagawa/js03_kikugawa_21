// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBmycUV4rIN_QBA4rgLkoZ9jqr27tngiG4",
    authDomain: "fir-demo-881dc.firebaseapp.com",
    projectId: "fir-demo-881dc",
    storageBucket: "fir-demo-881dc.appspot.com",
    messagingSenderId: "1058020188249",
    appId: "1:1058020188249:web:30d19cd0e871ae073f1148"
};


// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.database();
const chatRef = db.ref("chat");

// メッセージ削除時の処理
function deleteMessage(key) {
    // Firebaseからメッセージを削除
    chatRef.child(key).remove();
}

// メッセージを表示
function displayMessage(key, msg) {
    const messageElement = document.createElement("p");
    messageElement.innerHTML = `${msg.uname}: ${msg.text}`;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "削除";
    deleteButton.addEventListener("click", () => deleteMessage(key));

    messageElement.appendChild(deleteButton);

    $("#output").append(messageElement);
}

// データが追加された時の処理
chatRef.on("child_added", (snapshot) => {
    const key = snapshot.key;
    const msg = snapshot.val();

    displayMessage(key, msg);
});

// データが削除された時の処理
chatRef.on("child_removed", (snapshot) => {
    const key = snapshot.key;
    $("#" + key).remove();
});

$(document).ready(function () {
    // 送信ボタンが押されたら、データをDBに送信
    $("#send").on("click", function () {
        // 保存したいデータのオブジェクトを作る
        const msg = {
            uname: $("#uname").val(),
            text: $("#text").val()
        };

        // 新規のデータを送れる状態にセット
        const newPostRef = chatRef.push();

        // DBに値を送信
        newPostRef.set(msg);

        // 入力欄をクリア
        $("#text").val("");
    });

    // エンターキーが押されたら送信
    $("#text").on("keydown", function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            $("#send").click();
        }
    });
});
