
Output "docs/images/demo-init.gif"

Source "docs/demos/common.tape"

# Prepare demo environment

Hide

Type "rm -rf /tmp/shapit-vhs-demo"
Enter

Type "mkdir -p /tmp/shapit-vhs-demo"
Enter

Type "cd /tmp/shapit-vhs-demo"
Enter

Ctrl+L

Show
Sleep 800ms

# Initialize Shapit

Type "npx shapit init"
Sleep 400ms
Enter

Wait+Screen /Create configuration file/
Sleep 600ms

Type "y"
Enter

Wait+Screen /Created configuration file/
Sleep 1s

# Display generated configuration

Type "cat shapit.yml"
Sleep 400ms
Enter

Sleep 2s
