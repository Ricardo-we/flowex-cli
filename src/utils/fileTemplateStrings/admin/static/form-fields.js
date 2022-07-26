const formFieldsTemplate = `
function switchInput({ name, label, checked = false }) {
	return \`
    <div className="form-group">
        <div class="form-check form-switch">
            <input 
                name="\${name}" 
                value="true" 
                class="form-check-input" 
                type="checkbox" 
                \${checked ? "checked" : ""}  
                role="switch" 
            >
            <label class="form-check-label" for="flexSwitchCheckDefault">\${label}</label>
        </div>
    </div>
    \`;
}
function baseInput({ type, name, label, value }) {
	return \`
    <div className="form-group">
        <input 
            class="form-control" 
            name="\${name}" 
            type="\${type}" 
            value="\${value}"
            placeholder="\${label || name}"
        >
    </div>
    \`;
}

function selectInput({ name, options = [{ label: "", value: "" }], value }) {
	let allOptions = "";

	for (const option of options) {
		allOptions += \`
            <option value="\${option.value}">\${option.label}</option>
        \`;
	}

	return \`
    <div className="form-group">
        <select class="form-select" name="\${name}" value="\${value}">
            \${allOptions}
        </select>
    </div>
    \`;
}

`;

module.exports = formFieldsTemplate;
