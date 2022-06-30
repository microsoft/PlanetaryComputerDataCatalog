# Configuration file for the Sphinx documentation builder.
#
# This file only contains a selection of the most common options. For a full
# list see the documentation:
# https://www.sphinx-doc.org/en/master/usage/configuration.html

# -- Path setup --------------------------------------------------------------

# If extensions (or modules to document with autodoc) are in another directory,
# add these directories to sys.path here. If the directory is relative to the
# documentation root, use os.path.abspath to make it absolute, like shown here.
#
# import os
# import sys
# sys.path.insert(0, os.path.abspath('.'))


# -- Project information -----------------------------------------------------

project = "pc-data-catalog"
copyright = "2021, Microsoft"
author = "Planetary Computer Team"

# The full version, including alpha/beta/rc tags
release = "0.0.1"


# -- General configuration ---------------------------------------------------

# Add any Sphinx extension module names here, as strings. They can be
# extensions coming with Sphinx (named 'sphinx.ext.*') or your custom
# ones.
extensions = [
    "myst_parser",
    "nbsphinx",
    "sphinx.ext.autodoc",
    "sphinx.ext.intersphinx",
    "numpydoc",
]

myst_update_mathjax = False

nbsphinx_execute = "never"

nbsphinx_prolog = """
{% set docname = env.doc2path(env.docname, base=None) %}
{% set workspace = docname | replace("/", "-") | replace(".ipynb", "") %}

.. raw:: html

    <div class="docs-launcher">
        <a class="manual-ms-button manual-ms-primary"
           href="https://pccompute.westeurope.cloudapp.azure.com/compute/hub/user-redirect/git-pull?repo=https://github.com/microsoft/PlanetaryComputerExamples&urlpath=lab/workspaces/{{ workspace }}/tree/PlanetaryComputerExamples/{{ docname }}&branch=main"
           aria-label="Link will open in new tab" target="_blank" rel="noopener noreferrer"
           title="This example can be launched in the Planetary Computer Hub"
           target="_blank"
           rel="noopener noreferrer"
        >
        <span class="flex-container">
            <span>Launch in Hub</span>
        </span>
        </a>

        <a class="manual-ms-button manual-ms-secondary"
           href="https://github.com/microsoft/PlanetaryComputerExamples/blob/main/{{ docname }}"
           aria-label="Link will open in new tab" target="_blank" rel="noopener noreferrer"
           title="Suggest edits to this document"
           target="_blank"
           rel="noopener noreferrer"
        >
        <span class="flex-container">
            <span>Edit</span>
        </span>
        </a>
    </div>

"""


# Add any paths that contain templates here, relative to this directory.
# templates_path = ["_templates"]

# List of patterns, relative to source directory, that match files and
# directories to ignore when looking for source files.
# This pattern also affects html_static_path and html_extra_path.
exclude_patterns = ["README.md", "_build", "Thumbs.db", ".DS_Store"]

# -- Options for HTML output -------------------------------------------------

# The theme to use for HTML and HTML Help pages.  See the documentation for
# a list of builtin themes.
#
# html_theme = "pydata_sphinx_theme"

# Add any paths that contain custom static files (such as style sheets) here,
# relative to this directory. They are copied after the builtin static files,
# so a file named "default.css" will overwrite the builtin "default.css".
html_static_path = []
html_copy_source = False


intersphinx_mapping = {
    "rasterio": ("https://rasterio.readthedocs.io/en/latest/", None),
    "rioxarray": ("https://corteva.github.io/rioxarray/stable/", None),
}
