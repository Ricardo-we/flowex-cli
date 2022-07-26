const adminJsTemplate = `
const authToken = localStorage.getItem("flowex-token-key");
const headers = {
	"X-Authorization": authToken,
	"Content-Type": "application/json",
};

if (!authToken && window.location.pathname === "/admin")
	window.location.href = "/admin-users";

const errorAlert = (error) => Swal.fire({
		title: "Something went wrong",
		text: error,
		icon: "error",
	});

const createActionRequest = ({
	method = "POST",
	requestParams,
	form,
	model_name,
}) => {
	const formData = {};
	Array.from(form)?.forEach((input) =>
		input.name ? (formData[input.name] = input.value) : null,
	);

	return fetch(\`/admin\${requestParams}\`, {
		method,
		body: JSON.stringify({ ...formData, model_name }),
		headers,
	})
		.then(() => onSelectModel(model_name, "contentContainer"))
		.catch((error) => errorAlert(error?.toString()));
};

const onCreate = (event, form, model_name) => {
	event && event?.preventDefault();
	return createActionRequest({
		method: "POST",
		requestParams: \`?model_name=\${model_name}\`,
		form,
		model_name,
	})
		.then(Swal.close)
		.catch((error) => errorAlert(error.toString()));
};

const onUpdate = (event, form, model_name, objectId) => {
	event && event?.preventDefault();
	return createActionRequest({
		method: "PUT",
		requestParams: \`/\${model_name}?id=\${objectId}\`,
		form,
		model_name,
	})
		.then(Swal.close)
		.catch((error) => errorAlert(error.toString()));
};

const onDelete = (model_name, objectId, onEnd) => {
	return fetch(\`/admin/\${model_name}?id=\${objectId}\`, {
		method: "DELETE",
		headers,
	})
		.then(onEnd)
		.catch((error) => errorAlert(error.toString()))
		.finally(() => onSelectModel(model_name, "contentContainer"));
};

function renderTable(headings = [], body) {
	const table = document.createElement("table");
	table.classList.add("table");
	table.style = "overflow-x: auto; width: 100vw;";

	let headingsHtml = "";
	headingsHtml += "<tr>";
	headings.forEach(
		(heading) =>
			(headingsHtml += \`<th scope="col">\${heading}</th>\`),
	);
	headingsHtml += "</tr>";
	table.insertAdjacentHTML("beforeend", \`<thead>\${headingsHtml}</thead>\`);
	table.append(body);
	return table;
}

function renderTableRows(model, model_name) {
	const tableData = document.createElement("tbody");
	const rows = model.modelRecords;

	for (const row of rows) {
		const tableRow = document.createElement("tr");
		tableRow.addEventListener("click", () => {
			openUpdateModal(row, model.modelDetails, model_name);
		});
		tableRow.style = "max-height: 50px;cursor:pointer;";

		Object.values(row).forEach((column) => {
			tableRow.insertAdjacentHTML(
				"beforeend",
				\`
				<td 
					style="text-align:center;min-width: 100px;max-width: 200px;word-break: break-word;max-height: 50px;overflow-y: auto;"
				>
					\${column}
				</td>
			\`,
			);
		});
		tableData.append(tableRow);
	}
	return tableData;
}

function openUpdateModal(data, modelDetails, model_name) {
	const { actionsForm, submitButton } = renderForm(
		modelDetails,
		(e, form, model_name) => onUpdate(e, form, model_name, data.id),
		"Update",
		model_name,
		data,
	);
	const deleteButton = document.createElement("button");
	deleteButton.addEventListener("click", () =>
		Swal.fire({
			title: "Are you sure you want to delete this?",
			showCancelButton: true,
			preConfirm: () => onDelete(model_name, data.id, Swal.close),
		}),
	);
	deleteButton.classList.add("btn", "btn-danger", "w-100");
	deleteButton.innerText = "Delete";

	const container = document.createElement("div");
	container.appendChild(actionsForm);
	container.appendChild(submitButton);
	container.appendChild(deleteButton);

	Swal.fire({
		html: container,
		showConfirmButton: false,
		showCloseButton: true,
	});
}

function openCreateModal(model, model_name) {
	const { actionsForm, submitButton } = renderForm(
		model.modelDetails,
		onCreate,
		"Create",
		model_name,
	);
	const createFormContainer = document.createElement("div");
	createFormContainer.append(actionsForm, submitButton);

	return Swal.fire({
		html: createFormContainer,
		showConfirmButton: false,
		showCloseButton: true,
	});
}

function renderModelDetailView({ model, model_name, contentContainerId }) {
	const addButton = document.createElement("button");
	addButton.classList.add(
		"btn-primary",
		"d-flex",
		"align-items-center",
		"justify-content-center",
		"position-fixed",
		"bottom-0",
		"end-0",
		"rounded-circle",
	);
	addButton.style = "width: 40px; height: 40px;";
	addButton.innerHTML = \`<span class="material-icons">add</span>\`;
	document.body.appendChild(addButton);
	addButton.addEventListener("click", () =>
		openCreateModal(model, model_name),
	);

	const contentContainer = document.querySelector(\`#\${contentContainerId}\`);
	contentContainer.innerHTML = "";
	contentContainer.append(
		renderTable(
			Object.keys(model.modelDetails),
			renderTableRows(model, model_name),
		),
	);
}

function onSelectModel(model_name, contentContainerId, actionButtonId) {
	fetch(\`/admin/\${model_name}\`, {
		method: "GET",
		headers,
	})
		.then((res) => res.json())
		.then((res) => {
			renderModelDetailView({
				model: res,
				model_name,
				contentContainerId,
				actionButtonId,
			});
		})
		.catch((error) => errorAlert(error?.toString()));
}

const getFieldParentModel = (field, value) => {
	return fetch(\`/admin/\${field.references.model}\`, { headers })
		.then((res) => res.json())
		.then((res) => {
			const options = res?.modelRecords?.map((option) => ({
				value: option?.id,
				label: Object.values(option)[1],
			}));
			return selectInput({
				name: field.fieldName,
				value,
				options,
			});
		});
};

function renderForm(
	modelData,
	onSubmit,
	buttonText,
	model_name,
	defaultValues = {},
) {
	const fields = new Map();

	fields.set("INTEGER", "number");
	fields.set("REAL", "number");
	fields.set("DOUBLE", "number");
	fields.set("DECIMAL", "number");
	fields.set("FLOAT", "number");
	fields.set("STRING", "text");
	fields.set("CHAR", "text");
	fields.set("DATE", "date");
	fields.set("TIME", "date");

	const formHtml = document.createElement("form");
	const submitButton = document.createElement("button");
	submitButton.innerText = buttonText || "Create";
	submitButton.classList.add("btn", "btn-outline-primary", "w-100");

	formHtml.classList.add("form");

	for (const field of Object.values(modelData)) {
		const fieldType = field?.type;

		if (field?.autoIncrement || field._autoGenerated) {
			continue;
		} else if (field?.references) {
			getFieldParentModel(field, defaultValues[field.fieldName]).then(
				(parentSelect) => {
					formHtml.insertAdjacentHTML("beforeend", parentSelect);
				},
			);
		} else if (fieldType === "TEXT") {
			formHtml.insertAdjacentHTML(
				"beforeend",
				\`
				<textarea 
					placeholder="\${field.fieldName}" 
					name="\${field.fieldName}" 
					class="form-control" rows="3"
				>\${defaultValues[field.fieldName] || ""}</textarea>
			\`,
			
			);
		} else if (fieldType === "BOOLEAN") {
			formHtml.insertAdjacentHTML(
				"beforeend",
				switchInput({
					name: field.fieldName,
					label: field.fieldName,
					checked: defaultValues[field.fieldName],
				}),
			);
		} else {
			formHtml.insertAdjacentHTML(
				"beforeend",
				baseInput({
					name: field.fieldName,
					label: field.fieldName,
					value: defaultValues[field.fieldName] || "",
					type: fields.get(fieldType),
				}),
			);
		}
	}

	formHtml.addEventListener("submit", (e) =>
		onSubmit(e, formHtml, model_name),
	);
	submitButton.addEventListener("click", (e) => {
		onSubmit(e, formHtml, model_name);
	});

	return { actionsForm: formHtml, submitButton };
}

`;

module.exports = adminJsTemplate;
