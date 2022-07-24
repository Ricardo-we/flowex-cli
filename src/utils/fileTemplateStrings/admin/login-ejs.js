const login = `
<%- include('index', {models: null}); %>

    <div style="height: 70vh;max-width: 700px;min-height: 200px;"
        class="container-sm d-flex align-items-center justify-content-center">

        <form class="form container-sm" id="login-form">
            <h2>Flowex Login</h2>
            <% fields.forEach((field)=> { %>
                <div class="form-group">
                    <label>
                        <%=field.placeholder%>
                    </label>
                    <input class="form-control" type="<%=field.type%>" placeholder="<%=field.placeholder%>"
                        name="<%=field.name%>">
                </div>
                <% }); %>
                    <button class="btn btn-outline-primary w-100" type="submit">Login</button>
                    <%if(error){%>
                        <div class="alert alert-danger w-100" role="alert">
                            <%=error%>
                        </div>
                        <%}%>
        </form>
    </div>

    <script>
        document.addEventListener("DOMContentLoaded", () => {
            const loginForm = document.querySelector("#login-form");
            // console.log(loginForm.map(element => { name: element.name }))
            loginForm.addEventListener("submit", (e) => {
                e.preventDefault();
                let formData = {};
                Array.from(loginForm)?.forEach(input => input.name ? (formData[input.name] = input.value) : null);

                fetch("/admin-users/login", {
                    method: "POST",
                    body: JSON.stringify(formData),
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                    .then(res => res.json())
                    .then(res => {
                        if (res?.error || !res.token) throw new Error(res?.error?.message || "Not token");
                        localStorage.setItem("flowex-token-key", res.token)
                        window.location.href = "/admin"
                    })
                    .catch(error => Swal.fire({ icon: "error", title: error }));
            })

            const token = localStorage.getItem("flowex-token-key");
            // console.log(token);
            if (token) window.location.href = "/admin";

        })
    </script>

    </html>
`;
