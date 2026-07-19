import os
import sys

def fix_tests(dir_path):
    test_dir = os.path.join(dir_path, "__tests__")
    if not os.path.exists(test_dir):
        return
        
    for filename in os.listdir(test_dir):
        if filename.endswith(".tsx"):
            filepath = os.path.join(test_dir, filename)
            with open(filepath, 'r') as f:
                content = f.read()
            
            # Remove unused screen import
            if "import { render, screen } from '@testing-library/react';" in content and "screen." not in content:
                content = content.replace("import { render, screen } from '@testing-library/react';", "import { render } from '@testing-library/react';")
            
            # Fix DataBoundary specifically
            if "const { container } = render(" in content and "expect(container)" not in content and "container.firstChild" not in content:
                content = content.replace("const { container } = render(", "render(")
            
            with open(filepath, 'w') as f:
                f.write(content)

if __name__ == "__main__":
    dirs = ["fan", "ops", "staff", "ui", "organizer"]
    for d in dirs:
        fix_tests(f"src/components/{d}")
