"""! @brief Environment variables, constants and settings for the build process
 @file environment.py
 @section authors Author(s)
  - Created by Nicolas Dufresne on 1/3/2024 .
"""

import platform
import os
import json
import multiprocessing

class Environment():
    _instance = None

    @classmethod
    def instance( cls ):
        """!
        @brief Returns the Environment unique instance.
        """

        if cls._instance is None:
            cls._instance = cls.__new__(cls)

            cls.IS_WIN = platform.system() == 'Windows'
            cls.IS_LINUX = platform.system() == 'Linux'
            cls.IS_MAC = platform.system() == 'Darwin'
            cls.BUILD_THREADS = multiprocessing.cpu_count()
            cls.THIS_DIR = os.getcwd()

            # Try to auto find the environment file
            cls.ENV_FILE = ""
            cls.ENV = {}
            if cls.IS_WIN:
                cls.ENV_FILE = os.path.join(cls.THIS_DIR, 'win_environment.json')
            elif cls.IS_LINUX:
                cls.ENV_FILE = os.path.join(cls.THIS_DIR, 'linux_environment.json')
            else:
                cls.ENV_FILE = os.path.join(cls.THIS_DIR, 'mac_environment.json')

            # Try in the parent folder
            if not os.path.isfile(cls.ENV_FILE):
                d = os.path.dirname(os.path.realpath(__file__))
                d = os.path.dirname(d)
                if cls.IS_WIN:
                    cls.ENV_FILE = os.path.join(d, 'win_environment.json')
                elif cls.IS_LINUX:
                    cls.ENV_FILE = os.path.join(d, 'linux_environment.json')
                else:
                    cls.ENV_FILE = os.path.join(d, 'mac_environment.json')

            cls.REPO_DIR = cls.THIS_DIR

        return cls._instance

    def load_environment(self):
        """!
        @brief Loads the environment file ENV_FILE
        """
        from .utils import abs_path # pylint: disable=import-outside-toplevel

        if not os.path.isfile(self.ENV_FILE):
            print("Environment not found.")
            return None

        with open(self.ENV_FILE, encoding="utf8") as f:
            print("Parsing environment...")
            self.ENV = json.load(f)
            if not self.ENV:
                print("Can't read environement at " + self.ENV_FILE)
                return None

        if 'src' in self.ENV:
            self.REPO_DIR = self.ENV['src'].get('repo_path', self.THIS_DIR)
            if 'project' not in self.ENV['src']:
                self.ENV['src']['project'] = os.path.basename(self.REPO_DIR)
        else:
            self.ENV['src'] = {}

        self.REPO_DIR = abs_path(self.REPO_DIR)

        print(
            "Using this environment: " + self.ENV_FILE
        )

        return True

    def __init__(self):
        raise RuntimeError("Environement can't be initialized with `Environement()`, "
                           "it is a singleton.")
