const formFieldsTemplate = `
function switchInput({ name, label }) {
	return \`
    <div className="form-group">
        <div class="form-check form-switch">
            <input name="\${name}" class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault">
            <label class="form-check-label" for="flexSwitchCheckDefault">\${label}</label>
        </div>
    </div>
    \`;
}

function baseInput({ type, name, label }) {
	return \`
    <div className="form-group">
        <input 
            class="form-control" 
            name="\${name}" 
            type="\${type}" 
            placeholder="\${label || name}"
        >
    </div>
        \`;
}

function selectInput({ name, options = [{ label: "", value: "" }] }) {
	let allOptions = "";

	for (const option of options) {
		allOptions += \`
            <option value="\${option.value}">\${option.label}</option>
        \`;
	}

	return \`
    <div className="form-group">
        <select class="form-select" name="\${name}">
            \${allOptions}
        </select>
    </div>
    \`;
}


`;
