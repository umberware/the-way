## CoreStateEnum

This enum represents all core states.

### WAITING

Is the first state of the Core.

### BEFORE_INITIALIZATION_STARTED

Represents the Core creation process, is started.

### BEFORE_INITIALIZATION_DONE

The Core assume this state when the fundamental class and properties was loaded.

### INITIALIZATION_STARTED

The Core assume this state when the process of build instances & configure is started.

### INITIALIZATION_DONE

When every thing is configured and built, the Core will assume this state.

### READY

When the creation process of the Core is completed, the Core will assume this state.

### DESTRUCTION_STARTED

If an error occur in the creation process or is called the [Core.destroy](../../core.md#method-static-destroy) method, the Core State will assume this value.

### DESTRUCTION_DONE

The core will assume this state when the destruction process is completed.